#!/bin/bash
set -e

for dir in detail ratings review product; do
  if [ -d "$dir" ]; then
    echo "Deploying $dir"
    (cd "$dir" && serverless deploy --verbose || exit 1)
  fi
done

echo "All Serverless services deployed successfully."
