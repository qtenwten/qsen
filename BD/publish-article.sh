#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=".local/article-publisher.env"
JSON_FILE="${1:-}"

if [ -z "$JSON_FILE" ]; then
  echo "Usage: scripts/publish-article.sh path/to/article.json"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

curl -sS \
  -X POST "${ARTICLE_API_BASE_URL}/admin/articles" \
  -H "Authorization: Bearer ${ARTICLE_ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  --data @"$JSON_FILE"