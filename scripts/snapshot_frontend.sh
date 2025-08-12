#!/usr/bin/env bash
set -euo pipefail
cd erp-imobiliario/frontend

OUT="../../frontend_snapshot.txt"

{
  echo "# Snapshot do Frontend — $(date -Iseconds)"
  echo
  echo "## Versões"
  echo -n "node: "; node -v || true
  echo -n "npm:  "; npm -v || true
  echo

  echo "## package.json"
  sed -n '1,220p' package.json || true
  echo

  echo "## vite.config.ts"
  sed -n '1,220p' vite.config.ts 2>/dev/null || true
  echo

  echo "## tailwind.config.js"
  sed -n '1,220p' tailwind.config.js 2>/dev/null || true
  echo

  echo "## tsconfig.json"
  sed -n '1,220p' tsconfig.json 2>/dev/null || true
  echo

  echo "## Árvore de arquivos (src, profundidade 2)"
  find src -maxdepth 2 -type f | sort
  echo

  # conteúdos essenciais (primeiros 220 lines de cada um p/ não ficar gigante)
  for f in src/main.* src/App.* src/router.* src/routes.* src/pages/* src/components/*; do
    if [ -f "$f" ]; then
      echo "### FILE: $f"
      sed -n '1,220p' "$f"
      echo
    fi
  done
} > "$OUT"

cd ../..
git add frontend_snapshot.txt
git commit -m "chore: snapshot do frontend para revisão"
git push
