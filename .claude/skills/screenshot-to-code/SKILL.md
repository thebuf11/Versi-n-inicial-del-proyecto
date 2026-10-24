---
name: screenshot-to-code
description: Turn a screenshot or mockup image into HTML/CSS (or Tailwind/React) code. Use when the user provides a screenshot, design image or reference site and wants the UI recreated.
---

# Screenshot to code

Workflow inspired by https://github.com/abi/screenshot-to-code (the upstream app is not installed; it needs API keys and a backend).

1. View the image with Read and note layout, sections, palette, type, spacing.
2. Build the page section by section in the project's existing stack (vanilla HTML/CSS here), using CSS custom properties.
3. Render the result in a browser at 375px and 1280px, compare with the screenshot, and iterate until close.
4. Keep content real; never copy another site's text or branding.
