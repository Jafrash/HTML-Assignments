Employee Onboarding page

Files:
- src/onboarding.html — The new onboarding form page (links to ./output.css)
- src/input.css — Tailwind entry (already uses @import "tailwindcss")
- src/output.css — Compiled Tailwind CSS

How to rebuild `src/output.css` locally

If you modify classes or Tailwind config, rebuild `output.css` with the Tailwind CLI:

npx tailwindcss -i ./src/input.css -o ./src/output.css --watch

(Or run once without --watch to build a single time.)

How to view the page

Open `expensiveTailwind/src/onboarding.html` in your browser (double-click or use "Open File..."). While developing, run Tailwind in watch mode to pick up changes to classes.
