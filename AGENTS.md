# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable design direction

- Use French as the default language and provide a complete Arabic RTL switch.
- Keep Hamza's retouched profile photo prominent in the hero.
- Favor a modern editorial media-buyer aesthetic with bold performance proof, deep ink surfaces, warm ivory, and an electric-lime accent.
- Portfolio creative previews must show the full artwork without cropping, with an accessible enlarged view.
- Clearly label AI-generated advertising concepts as concept work rather than client results.
- Open the CV in an in-site preview instead of forcing or suggesting a device download.
- Use the generated HE performance-signal logo as the primary brand mark.
- Keep hero interactions subtle, purposeful, touch-safe, and compatible with reduced-motion preferences.
