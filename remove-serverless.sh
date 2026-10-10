#!/bin/bash
set -e

for dir in detail ratings review product; do
  if [ -d "$dir" ]; then
    echo "Removing Serverless stack from $dir"
    (cd "$dir" && serverless remove --verbose || true)
  fi
done
