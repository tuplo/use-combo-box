#!/usr/bin/env bash
set -euo pipefail

main() {
  IS_REACT_ACT_ENVIRONMENT=true jest --ci "${1:-}"
}

main "${@}"
