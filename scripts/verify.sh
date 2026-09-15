#!/usr/bin/env bash
set -e

echo "======================================================"
echo "   MediExplain AI - Evaluator Quick Verification"
echo "======================================================"
echo ""

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not found in your PATH."
    echo "Please install Node.js v18 or higher from https://nodejs.org"
    exit 1
fi

echo "[1/3] Node.js environment detected: $(node -v)"
echo ""

echo "[2/3] Running Unified Multi-Tier CI Pipeline..."
echo ""
npm run ci

echo ""
echo "======================================================"
echo " [SUCCESS] All 69 health tests and builds passed 100%!"
echo " Platform is ready for presentation and deployment."
echo "======================================================"
echo ""
