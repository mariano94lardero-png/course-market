#!/usr/bin/env bash
# Genera un PDF de revisión (A5) a partir del manuscrito Markdown.
# Requiere pandoc y Chromium. Uso: ./generar-pdf.sh [ruta_chromium]
set -euo pipefail
cd "$(dirname "$0")"
CHROME="${1:-${CHROME:-chromium}}"
pandoc -f markdown-yaml_metadata_block gana-tu-dia.md -s \
  --metadata pagetitle="Gana tu día" --metadata lang=es-ES \
  -c estilo-pdf.css --embed-resources -o gana-tu-dia.html
"$CHROME" --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=gana-tu-dia-borrador.pdf gana-tu-dia.html
rm gana-tu-dia.html
