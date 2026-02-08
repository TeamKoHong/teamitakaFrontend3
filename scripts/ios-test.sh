#!/bin/bash
# iOS Simulator Safe-Area Test Script
# Captures 5 screens: Main, ProjectManagement, TeamMatching, Search, Profile

set -e

IDB="/Library/Frameworks/Python.framework/Versions/3.12/bin/idb"
UDID="C54589A8-3A4B-4DEC-96C1-DF1F05C694D8"
OUT="/tmp/teamitaka-screenshots"
DELAY=2

mkdir -p "$OUT"

echo "=== iOS Safe-Area Test ==="
echo "Device: iPhone 15 Pro Max ($UDID)"
echo "Output: $OUT"
echo ""

# Tab bar coordinates (device points, 430x932 viewport)
TAB_MAIN_X=54;    TAB_Y=910
TAB_PROJ_X=161
TAB_TEAM_X=269
TAB_PROF_X=376

# Search icon on TeamMatching screen (found via ImageMagick crop analysis)
SEARCH_X=337; SEARCH_Y=95

# Helper: tap + wait + screenshot
capture() {
  local name="$1" x="$2" y="$3"
  echo "[$name] Tapping ($x, $y)..."
  $IDB ui tap "$x" "$y" --udid "$UDID" > /dev/null 2>&1
  sleep "$DELAY"
  xcrun simctl io "$UDID" screenshot "$OUT/${name}.png" 2>&1 | tail -1
  echo "[$name] Done."
}

# 1) Main tab
capture "01-main" $TAB_MAIN_X $TAB_Y

# 2) Project Management tab
capture "02-project-management" $TAB_PROJ_X $TAB_Y

# 3) Team Matching tab
capture "03-team-matching" $TAB_TEAM_X $TAB_Y

# 4) Search screen (from team matching, tap search icon)
capture "04-search" $SEARCH_X $SEARCH_Y

# 5) Go back to team matching, then Profile tab
echo "[back] Navigating back from search..."
# Tap back or navigate to profile directly
$IDB ui tap $TAB_PROF_X $TAB_Y --udid "$UDID" > /dev/null 2>&1
sleep "$DELAY"

# Profile tab
capture "05-profile" $TAB_PROF_X $TAB_Y

echo ""
echo "=== All screenshots captured ==="
ls -la "$OUT"/*.png
