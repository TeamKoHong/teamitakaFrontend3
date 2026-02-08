#!/bin/bash
#
# App Store Screenshot Capture - Interactive Workflow
# 티미타카 (TeamItaka)
#
# Usage:
#   ./scripts/capture-screenshots.sh              # Full workflow
#   ./scripts/capture-screenshots.sh --skip-build  # Skip web build & sync
#   ./scripts/capture-screenshots.sh --6.7-only    # 6.7" device only
#   ./scripts/capture-screenshots.sh --6.5-only    # 6.5" device only
#

set -euo pipefail

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORKSPACE="$PROJECT_ROOT/ios/App/App.xcworkspace"
SCHEME="App"
BUNDLE_ID="com.teamitaka.teamitaka"
OUTPUT_BASE="$HOME/Desktop/AppStoreScreenshots"

# Simulator devices
declare -A DEVICES
DEVICES=(
  ["6.7inch"]="C54589A8-3A4B-4DEC-96C1-DF1F05C694D8|iPhone 15 Pro Max|1290x2796"
  ["6.5inch"]="B0CC25DC-99F2-4235-9B07-620A3744C728|iPhone 15 Plus|1290x2796"
)

# Recommended screens
RECOMMENDED_SCREENS=(
  "1. onboarding  - 온보딩/랜딩 화면"
  "2. main        - 메인 홈 피드"
  "3. recruitment - 프로젝트 모집 목록"
  "4. team-matching - 팀 매칭"
  "5. project-detail - 프로젝트 상세"
  "6. profile     - 프로필"
)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ─────────────────────────────────────────────
# Parse arguments
# ─────────────────────────────────────────────

SKIP_BUILD=false
ONLY_67=false
ONLY_65=false

for arg in "$@"; do
  case $arg in
    --skip-build) SKIP_BUILD=true ;;
    --6.7-only)   ONLY_67=true ;;
    --6.5-only)   ONLY_65=true ;;
    -h|--help)
      echo "Usage: $0 [--skip-build] [--6.7-only] [--6.5-only]"
      echo ""
      echo "  --skip-build   Skip npm build & cap sync (use existing build)"
      echo "  --6.7-only     Only capture 6.7\" screenshots"
      echo "  --6.5-only     Only capture 6.5\" screenshots"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $arg${NC}"
      exit 1
      ;;
  esac
done

# ─────────────────────────────────────────────
# Helper functions
# ─────────────────────────────────────────────

print_header() {
  echo ""
  echo -e "${BOLD}${BLUE}═══════════════════════════════════════════${NC}"
  echo -e "${BOLD}${BLUE}  $1${NC}"
  echo -e "${BOLD}${BLUE}═══════════════════════════════════════════${NC}"
  echo ""
}

print_step() {
  echo -e "${CYAN}▸ $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# ─────────────────────────────────────────────
# Web Build & iOS Sync
# ─────────────────────────────────────────────

build_web() {
  if [ "$SKIP_BUILD" = true ]; then
    print_warning "빌드 건너뛰기 (--skip-build)"
    return 0
  fi

  print_header "웹 빌드 & iOS 동기화"

  print_step "npm run build..."
  cd "$PROJECT_ROOT"
  npm run build
  print_success "웹 빌드 완료"

  print_step "npx cap sync ios..."
  npx cap sync ios
  print_success "iOS 동기화 완료"
}

# ─────────────────────────────────────────────
# Simulator Management
# ─────────────────────────────────────────────

setup_simulator() {
  local uuid="$1"
  local name="$2"

  print_step "시뮬레이터 부팅: $name..."

  # Boot if not already booted
  local state
  state=$(xcrun simctl list devices | grep "$uuid" | grep -o "(Booted)" || true)
  if [ -z "$state" ]; then
    xcrun simctl boot "$uuid" 2>/dev/null || true
    # Wait for boot
    local retries=0
    while [ $retries -lt 30 ]; do
      state=$(xcrun simctl list devices | grep "$uuid" | grep -o "(Booted)" || true)
      if [ -n "$state" ]; then
        break
      fi
      sleep 1
      retries=$((retries + 1))
    done
    if [ -z "$state" ]; then
      print_error "시뮬레이터 부팅 실패"
      return 1
    fi
  fi
  print_success "시뮬레이터 부팅 완료"

  # Open Simulator.app to foreground
  open -a Simulator

  # Clean up status bar for App Store screenshots
  print_step "상태바 설정 (9:41, 배터리 100%, 셀룰러 풀)..."
  xcrun simctl status_bar "$uuid" override \
    --time "9:41" \
    --batteryState charged \
    --batteryLevel 100 \
    --cellularMode active \
    --cellularBars 4 \
    --wifiBars 3 \
    --operatorName ""
  print_success "상태바 설정 완료"
}

shutdown_simulator() {
  local uuid="$1"
  local name="$2"

  print_step "시뮬레이터 종료: $name..."
  # Clear status bar override
  xcrun simctl status_bar "$uuid" clear 2>/dev/null || true
  xcrun simctl shutdown "$uuid" 2>/dev/null || true
  print_success "시뮬레이터 종료 완료"
}

# ─────────────────────────────────────────────
# Build & Install App on Simulator
# ─────────────────────────────────────────────

build_and_install() {
  local uuid="$1"
  local name="$2"

  print_step "앱 빌드 중 ($name)..."

  # Determine simulator SDK name from device name
  local destination="platform=iOS Simulator,id=$uuid"

  # Build for simulator
  xcodebuild \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -destination "$destination" \
    -configuration Debug \
    -derivedDataPath "$PROJECT_ROOT/ios/DerivedData" \
    build \
    2>&1 | tail -5

  # Find the built .app
  local app_path
  app_path=$(find "$PROJECT_ROOT/ios/DerivedData" -name "App.app" -path "*/Debug-iphonesimulator/*" | head -1)

  if [ -z "$app_path" ]; then
    print_error "빌드된 .app 파일을 찾을 수 없습니다"
    return 1
  fi

  print_success "앱 빌드 완료"

  # Install
  print_step "앱 설치 중..."
  xcrun simctl install "$uuid" "$app_path"
  print_success "앱 설치 완료"

  # Launch
  print_step "앱 실행 중..."
  xcrun simctl launch "$uuid" "$BUNDLE_ID"
  print_success "앱 실행 완료"

  # Give time for app to load
  sleep 3
}

# ─────────────────────────────────────────────
# Screenshot Capture
# ─────────────────────────────────────────────

capture_screenshot() {
  local uuid="$1"
  local output_dir="$2"
  local filename="$3"

  local filepath="$output_dir/${filename}.png"
  xcrun simctl io "$uuid" screenshot "$filepath"

  # Verify resolution
  local width height
  width=$(sips -g pixelWidth "$filepath" | tail -1 | awk '{print $2}')
  height=$(sips -g pixelHeight "$filepath" | tail -1 | awk '{print $2}')

  print_success "캡처 완료: ${filename}.png (${width}x${height})"
}

# ─────────────────────────────────────────────
# Interactive Capture Loop
# ─────────────────────────────────────────────

capture_loop() {
  local uuid="$1"
  local size_label="$2"
  local output_dir="$3"
  local count=0

  echo ""
  echo -e "${BOLD}${CYAN}╔═══════════════════════════════════════════╗${NC}"
  echo -e "${BOLD}${CYAN}║  인터랙티브 캡처 모드 - $size_label${NC}"
  echo -e "${BOLD}${CYAN}╚═══════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${YELLOW}추천 캡처 화면:${NC}"
  for screen in "${RECOMMENDED_SCREENS[@]}"; do
    echo -e "  ${screen}"
  done
  echo ""
  echo -e "${YELLOW}사용법:${NC}"
  echo -e "  1. 시뮬레이터에서 원하는 화면으로 이동"
  echo -e "  2. Enter 키를 눌러 캡처"
  echo -e "  3. 파일명 입력 (예: home, profile)"
  echo -e "  4. 'q' 또는 'done' 입력으로 종료"
  echo ""

  while true; do
    echo -e "${BOLD}────────────────────────────────────${NC}"
    echo -ne "${CYAN}화면을 준비한 후 Enter를 누르세요 (q=종료): ${NC}"
    read -r ready

    if [[ "$ready" == "q" || "$ready" == "done" || "$ready" == "quit" ]]; then
      break
    fi

    echo -ne "${CYAN}파일명 입력 (확장자 제외): ${NC}"
    read -r filename

    if [ -z "$filename" ]; then
      count=$((count + 1))
      filename="screenshot_${count}"
      print_warning "파일명 미입력 → $filename 사용"
    fi

    # Sanitize filename (replace spaces with underscores)
    filename=$(echo "$filename" | tr ' ' '_' | tr -cd '[:alnum:]_-')

    # Check if file already exists
    if [ -f "$output_dir/${filename}.png" ]; then
      echo -ne "${YELLOW}파일이 이미 존재합니다. 덮어쓸까요? [y/N]: ${NC}"
      read -r overwrite
      if [[ "$overwrite" != "y" && "$overwrite" != "Y" ]]; then
        print_warning "건너뛰기"
        continue
      fi
    fi

    capture_screenshot "$uuid" "$output_dir" "$filename"
    count=$((count + 1))
  done

  echo ""
  print_success "$size_label 캡처 완료: ${count}장"
  return 0
}

# ─────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────

show_summary() {
  print_header "캡처 결과 요약"

  local total=0

  for size in "6.7inch" "6.5inch"; do
    local dir="$OUTPUT_BASE/$size"
    if [ -d "$dir" ]; then
      local files
      files=$(find "$dir" -name "*.png" -type f 2>/dev/null)
      local file_count
      file_count=$(echo "$files" | grep -c "." 2>/dev/null || echo "0")

      if [ "$file_count" -gt 0 ]; then
        echo -e "${BOLD}${size} (${file_count}장):${NC}"
        while IFS= read -r file; do
          if [ -n "$file" ]; then
            local name width height
            name=$(basename "$file")
            width=$(sips -g pixelWidth "$file" | tail -1 | awk '{print $2}')
            height=$(sips -g pixelHeight "$file" | tail -1 | awk '{print $2}')
            echo -e "  ${GREEN}✓${NC} $name (${width}x${height})"
            total=$((total + 1))
          fi
        done <<< "$files"
        echo ""
      fi
    fi
  done

  if [ "$total" -eq 0 ]; then
    print_warning "캡처된 스크린샷이 없습니다"
  else
    echo -e "${BOLD}총 ${total}장 캡처 완료${NC}"
    echo ""
    echo -e "${GREEN}스크린샷 저장 위치: $OUTPUT_BASE${NC}"
    echo -e "${CYAN}App Store Connect에 업로드할 준비가 되었습니다!${NC}"
  fi
}

# ─────────────────────────────────────────────
# Device workflow
# ─────────────────────────────────────────────

run_device() {
  local size="$1"
  local device_info="${DEVICES[$size]}"

  IFS='|' read -r uuid name resolution <<< "$device_info"
  local output_dir="$OUTPUT_BASE/$size"

  print_header "$size 스크린샷 캡처 ($name)"

  # Ensure output directory exists
  mkdir -p "$output_dir"

  # Setup simulator
  setup_simulator "$uuid" "$name"

  # Build and install app
  build_and_install "$uuid" "$name"

  # Interactive capture
  capture_loop "$uuid" "$size" "$output_dir"

  # Shutdown simulator
  shutdown_simulator "$uuid" "$name"
}

# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────

main() {
  print_header "App Store 스크린샷 캡처 - 티미타카"

  echo -e "${BOLD}설정:${NC}"
  echo -e "  프로젝트: $PROJECT_ROOT"
  echo -e "  출력 폴더: $OUTPUT_BASE"
  echo -e "  빌드 건너뛰기: $SKIP_BUILD"
  echo ""

  # Step 1: Web build
  build_web

  # Step 2: Determine which devices to capture
  local devices_to_run=()

  if [ "$ONLY_67" = true ]; then
    devices_to_run=("6.7inch")
  elif [ "$ONLY_65" = true ]; then
    devices_to_run=("6.5inch")
  else
    devices_to_run=("6.7inch" "6.5inch")
  fi

  # Step 3: Run each device
  for size in "${devices_to_run[@]}"; do
    run_device "$size"

    # If there's another device, ask to continue
    if [ "$size" = "6.7inch" ] && [ "$ONLY_67" = false ] && [ "$ONLY_65" = false ]; then
      echo ""
      echo -ne "${YELLOW}6.5인치 디바이스로 계속 진행할까요? [Y/n]: ${NC}"
      read -r continue_65
      if [[ "$continue_65" == "n" || "$continue_65" == "N" ]]; then
        print_warning "6.5인치 캡처 건너뛰기"
        break
      fi
    fi
  done

  # Step 4: Summary
  show_summary
}

main
