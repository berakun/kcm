#!/bin/bash
# KCM Asset Cleanup Script
# Deletes unused icon/logo files and old favicons
# Run: bash cleanup-assets.sh

cd "$(dirname "$0")"

echo "=== KCM Asset Cleanup ==="

# 1. Delete src/icon/ directory (unused kcm.png)
if [ -d "src/icon" ]; then
  rm -rf src/icon/
  echo "✓ Deleted src/icon/ (unused kcm.png)"
fi

# 2. Delete unused logo variants
for f in public/logo.png public/logo-square.png public/logo-square-transparent.png; do
  if [ -f "$f" ]; then
    rm "$f"
    echo "✓ Deleted $f"
  fi
done

# 3. Delete old favicons (replaced by logo-transparent.png in index.html)
for f in public/favicon.svg public/favicon.png; do
  if [ -f "$f" ]; then
    rm "$f"
    echo "✓ Deleted $f"
  fi
done

echo ""
echo "=== Remaining public/ assets ==="
ls -la public/

echo ""
echo "=== Remaining src/ structure ==="
find src/ -name "*.png" -o -name "*.svg" -o -name "*.ico" -o -name "*.jpg" -o -name "*.jpeg" 2>/dev/null

echo ""
echo "Done! Rebuild with: npm run build"
