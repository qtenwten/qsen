#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=".local/article-publisher.env"
SLUG="${1:-}"

if [ -z "$SLUG" ]; then
  echo "Usage: scripts/check-article.sh article-slug"
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

curl -sS "${ARTICLE_API_BASE_URL}/articles/${SLUG}"