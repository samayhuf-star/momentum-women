#!/usr/bin/env bash
# Momentum flow for .github/workflows/sim-qa.yml.
# Env from the workflow: UDID, BUNDLE_ID, SCHEME, WORKSPACE, DERIVED_DATA, OUT.
# Installs the app, then runs MomentumWomenQATests XCUITest: guest launch, home, workout
# (exercise-detail media), the five listing screens under $OUT/listing, paywall, Restore.
# When LISTING_SIZE is 1290x2796 (6.9" simulator), those five PNGs must be that size.
set -euo pipefail
: "${UDID:?}" "${BUNDLE_ID:?}" "${SCHEME:?}" "${WORKSPACE:?}" "${DERIVED_DATA:?}" "${OUT:?}"
mkdir -p "$OUT"

echo "==> Install"
APP=$(find "$DERIVED_DATA/Build/Products" -maxdepth 2 -name "$SCHEME.app" -path '*Release-iphonesimulator*' | head -n1)
echo "app: $APP"
xcrun simctl install "$UDID" "$APP"

echo "==> XCUITest flow"
mkdir -p /tmp/momentum-sk
cp qa/MomentumWomen.storekit /tmp/momentum-sk/MomentumWomen.storekit
set +e
TEST_RUNNER_SIM_QA_OUT="$OUT" TEST_RUNNER_STOREKIT_CONFIG="/tmp/momentum-sk/MomentumWomen.storekit" \
xcodebuild test-without-building -workspace "$WORKSPACE" -scheme "$SCHEME" -configuration Release \
  -destination "platform=iOS Simulator,id=$UDID" -derivedDataPath "$DERIVED_DATA" \
  -resultBundlePath "$OUT/flow.xcresult" -only-testing:MomentumWomenQATests/SimQATests/testMomentumFlow \
  > "$OUT/xcodebuild-test.log" 2>&1
RC=$?
set -e
tail -n 80 "$OUT/xcodebuild-test.log"
grep "\[momentum-qa\]" "$OUT/xcodebuild-test.log" || true

mkdir -p "$OUT/attachments"
xcrun xcresulttool export attachments --path "$OUT/flow.xcresult" --output-path "$OUT/attachments" >/dev/null 2>&1 || true

python3 - "$OUT" "$RC" <<'PY'
import json, os, sys
out, rc = sys.argv[1], int(sys.argv[2])
p = os.path.join(out, "results.json")
steps = json.load(open(p)).get("steps", []) if os.path.exists(p) else []
lines = ["# Momentum iOS Simulator QA", "", f"xcodebuild test exit: {rc}", "", "| Step | Result | Detail |", "| --- | --- | --- |"]
for s in steps:
    lines.append(f"| {s['step']}. {s['name']} | {'PASS' if s['pass'] else 'FAIL'} | {str(s['detail']).replace('|', '/')} |")
if not steps:
    lines.append("| none | FAIL | results.json missing |")
open(os.path.join(out, "summary.md"), "w").write("\n".join(lines) + "\n")
print("\n".join(lines))
failed = [s for s in steps if not s.get("pass")]
if not steps or failed or rc != 0:
    raise SystemExit(rc if rc else 1)
PY

python3 - "$OUT" <<'PY'
import os, struct, sys
out = sys.argv[1]
want = os.environ.get("LISTING_SIZE", "").strip()
if not want:
    raise SystemExit(0)
want_w, want_h = (int(part) for part in want.split("x"))
names = [
    "01-home.png",
    "02-workout.png",
    "03-exercise-detail.png",
    "04-progress.png",
    "05-plans.png",
]
bad = []
for name in names:
    path = os.path.join(out, "listing", name)
    if not os.path.exists(path):
        bad.append(name + " missing")
        continue
    with open(path, "rb") as handle:
        header = handle.read(24)
    width, height = struct.unpack(">II", header[16:24])
    if (width, height) != (want_w, want_h):
        bad.append(f"{name} is {width}x{height}")
if bad:
    print("listing screenshot check failed:", "; ".join(bad))
    raise SystemExit(1)
print(f"listing screenshots {want}: ok")
PY
exit $?
