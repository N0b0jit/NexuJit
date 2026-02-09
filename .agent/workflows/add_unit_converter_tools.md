---
description: Add and enhance Unit Converter tools, redesign UI, add tests, and suggest free useful tools
---

## Overview
This workflow outlines the steps required to:
1. **Analyze** the current project structure, especially the `UnitConverter` component and related tool pages.
2. **Design** a polished UI for the unit converter using modern CSS (glassmorphism, dark mode, smooth animations).
3. **Implement** missing conversion categories (Lifestyle, Webmaster, Business) as separate reusable components.
4. **Add functional logic** for each new tool, ensuring they work out‑of‑the‑box without external APIs.
5. **Write unit tests** with Jest/React Testing Library for conversion accuracy and UI interactions.
6. **Provide a curated list** of completely free, useful tools that can be added to the platform.
7. **Document** the changes and create a README section for future contributors.

## Steps

1. **Project Analysis**
   - Open `src/components/tools/UnitConverter.tsx` and identify existing conversion types.
   - Review `src/app/tools/[slug]/page.tsx` to see how tools are routed and displayed.
   - List any missing categories (Lifestyle, Webmaster, Business) and note UI inconsistencies.

2. **UI Redesign**
   // turbo
   - Create a new CSS module `UnitConverter.module.css` with glassmorphism, dark‑mode variables, and micro‑animations for input focus and button hover.
   - Update `UnitConverter.tsx` to import the CSS module and replace inline styles with classNames.
   - Add a subtle background blur and gradient to the converter card.

3. **Add New Conversion Categories**
   - Create three new components in `src/components/tools/`:
     - `LifestyleConverter.tsx`
     - `WebmasterConverter.tsx`
     - `BusinessToolkit.tsx`
   - Each component should export a default function that receives `{ title, description }` props and internally uses the existing `UnitConverter` with a specific `type` prop (e.g., `'digital'` for lifestyle, `'speed'` for webmaster, `'weight'` for business) or define custom unit maps if needed.
   - Register these components in `src/app/tools/[slug]/page.tsx` within the `toolComponents` map.

4. **Functional Logic**
   - Ensure the `UNITS` object in `UnitConverter.tsx` contains all required units for the new categories (e.g., `digital`, `speed`, `weight`).
   - Add helper functions for any non‑standard conversions (e.g., converting pixels to rem, DPI to PPI) directly in the component – no external API calls.

5. **Testing**
   // turbo
   - Add a new test file `src/components/tools/__tests__/UnitConverter.test.tsx`.
   - Write tests to verify:
     * Correct conversion results for each unit type.
     * Swap button swaps `from` and `to` units.
     * Copy button places the formatted result on the clipboard.
   - Run `npm test` to ensure all tests pass.

6. **Suggest Free Tools** (no API required)
   - **JSON Formatter & Validator** – simple pretty‑print and syntax check.
   - **Base64 Encoder/Decoder** – already present, ensure UI consistency.
   - **Password Generator** – generate strong passwords locally.
   - **QR Code Generator** – client‑side generation using `qrcode` library.
   - **Color Contrast Checker** – compute WCAG contrast ratios.
   - **Word Counter & Reading Time** – count words and estimate reading time.
   - **Slugifier** – convert titles to URL‑friendly slugs.
   - **Markdown Previewer** – render markdown to HTML in the browser.
   - **Currency Converter (offline rates)** – use a static JSON file with common rates.
   - **File Size Converter** – bytes ↔ KB ↔ MB ↔ GB.
   - Add these to the `toolComponents` map and create minimal UI pages following the pattern of existing tools.

7. **Documentation**
   - Update `README.md` with a new section **"Unit Converter Enhancements"** describing how to add new conversion types.
   - Add a **"Free Utilities"** subsection listing the suggested tools and their purpose.

8. **Commit & Push**
   - Stage all changes, commit with message `feat: enhance unit converter UI, add lifestyle/webmaster/business tools, add tests`.
   - Push to the repository.

## Completion Checklist
- [ ] Project analysis completed.
- [ ] UI redesign applied and CSS module created.
- [ ] New components (`LifestyleConverter`, `WebmasterConverter`, `BusinessToolkit`) added and registered.
- [ ] All conversion logic works without external APIs.
- [ ] Jest tests written and passing.
- [ ] Free tool suggestions documented and stub components created.
- [ ] README updated.
- [ ] Changes committed and pushed.

---
*This workflow can be executed step‑by‑step manually or automated via a CI script.*
