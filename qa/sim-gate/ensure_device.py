#!/usr/bin/env python3
"""Boot a simulator by name, creating it when the runtime has the device type."""

from __future__ import annotations

import json
import re
import subprocess
import sys


def simctl(*args: str, check: bool = True) -> str:
    result = subprocess.run(
        ["xcrun", "simctl", *args],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if check and result.returncode != 0:
        sys.stderr.write(result.stderr)
        raise SystemExit(result.returncode)
    return result.stdout


def slug(name: str) -> str:
    text = name.lower()
    text = text.replace("(", "").replace(")", "")
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text


def latest_ios_runtime(runtimes: list[dict]) -> dict | None:
    ios = [
        runtime
        for runtime in runtimes
        if runtime.get("isAvailable", True)
        and "iOS" in str(runtime.get("name", ""))
        and not runtime.get("isInternal", False)
    ]
    if not ios:
        return None

    def key(runtime: dict) -> tuple:
        version = str(runtime.get("version") or "0")
        parts = []
        for piece in version.split("."):
            try:
                parts.append(int(piece))
            except ValueError:
                parts.append(0)
        return tuple(parts)

    ios.sort(key=key)
    return ios[-1]


def find_device(devices: dict, name: str) -> tuple[str, str] | None:
    hits: list[tuple[str, str]] = []
    for runtime, entries in devices.items():
        if "iOS" not in runtime:
            continue
        for entry in entries:
            if entry.get("name") == name and entry.get("isAvailable", True):
                hits.append((runtime, entry["udid"]))
    if not hits:
        return None
    hits.sort(key=lambda item: item[0])
    return hits[-1]


def find_type(types: list[dict], name: str) -> dict | None:
    for entry in types:
        if entry.get("name") == name or entry.get("identifier", "").endswith(name):
            return entry
    return None


def main() -> None:
    requested = sys.argv[1]
    fallback = sys.argv[2] if len(sys.argv) > 2 else ""
    devices = json.loads(simctl("list", "devices", "available", "-j"))["devices"]
    chosen_name = requested
    found = find_device(devices, requested)
    if not found and fallback:
        found = find_device(devices, fallback)
        if found:
            chosen_name = fallback
            print(f"using fallback device {fallback}", file=sys.stderr)

    if not found:
        types = json.loads(simctl("list", "devicetypes", "-j"))["devicetypes"]
        runtimes = json.loads(simctl("list", "runtimes", "-j"))["runtimes"]
        runtime = latest_ios_runtime(runtimes)
        if not runtime:
            print("no available iOS simulator runtime", file=sys.stderr)
            raise SystemExit(1)
        device_type = find_type(types, requested) or (find_type(types, fallback) if fallback else None)
        if device_type and device_type.get("name") != requested:
            chosen_name = device_type["name"]
            print(f"creating fallback device type {chosen_name}", file=sys.stderr)
        if not device_type:
            names = sorted({entry.get("name", "") for entry in types if "iPhone" in entry.get("name", "")})
            print(f"device type not found: {requested!r} fallback={fallback!r}", file=sys.stderr)
            print("iphone device types:", ", ".join(names), file=sys.stderr)
            raise SystemExit(1)
        created = simctl(
            "create",
            chosen_name,
            device_type["identifier"],
            runtime["identifier"],
        ).strip()
        udid = created.splitlines()[-1].strip()
        runtime_name = runtime.get("name", runtime["identifier"])
        print(f"created {chosen_name} on {runtime_name}: {udid}", file=sys.stderr)
    else:
        runtime_name, udid = found
        print(f"reusing {chosen_name} on {runtime_name}: {udid}", file=sys.stderr)

    simctl("shutdown", udid, check=False)
    erase = subprocess.run(["xcrun", "simctl", "erase", udid], text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if erase.returncode != 0:
        print(erase.stderr, file=sys.stderr)
        raise SystemExit(erase.returncode)
    simctl("boot", udid, check=False)
    subprocess.run(["xcrun", "simctl", "bootstatus", udid, "-b"], check=True)
    status = subprocess.run(
        [
            "xcrun", "simctl", "status_bar", udid, "override",
            "--time", "9:41",
            "--dataNetwork", "wifi",
            "--wifiMode", "active",
            "--wifiBars", "3",
            "--cellularMode", "active",
            "--cellularBars", "4",
            "--batteryState", "charged",
            "--batteryLevel", "100",
        ],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if status.returncode != 0:
        print("status_bar override skipped:", status.stderr.strip(), file=sys.stderr)

    subprocess.run(["open", "-a", "Simulator", "--args", "-CurrentDeviceUDID", udid], check=False)
    print(f"udid={udid}")
    print(f"name={chosen_name}")
    print(f"slug={slug(chosen_name)}")


if __name__ == "__main__":
    main()
