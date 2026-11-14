#!/usr/bin/env bash
# Prepare step for AI-Samay/sim-qa-runner sim-qa.yml (after pod install, before the build).
set -euo pipefail
mkdir -p "${OUT:-/tmp/sim-qa}"
gem list -i xcodeproj >/dev/null 2>&1 || gem install xcodeproj --no-document
ruby qa/scripts/prepare-xcode-qa.rb | tee -a "${OUT:-/tmp/sim-qa}/prepare.log"
grep -n "StoreKitConfigurationFileReference" -A1 ios/*.xcodeproj/xcshareddata/xcschemes/*.xcscheme | tee -a "${OUT:-/tmp/sim-qa}/prepare.log"
