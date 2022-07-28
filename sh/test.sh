#!/usr/bin/env bash
set -euo pipefail

main() {
  IS_REACT_ACT_ENVIRONMENT=true jest --watch "${1:-}"
}

main "${@}"
