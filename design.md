# TKA Mudah Design Guide

## Source

- Figma file: `https://www.figma.com/design/bVAGt0Cs08k0sRxEJxTrLc/tkamudah?node-id=67-2&m=dev&t=KtnmI9HU6OwO2vi4-1`
- Product: `TKA Mudah`
- Target app: `TKA-Mudah` (`Next.js 16`, `React 19`, `TypeScript`, `Tailwind CSS 4`)

## Status

- This is the first design handoff document for the current `TKA Mudah` UI.
- The Figma node above is the design source of truth.
- Figma MCP inspection was not available during this draft, so this document is written as an implementation guide and alignment baseline for the current repo.
- Any pixel value, icon swap, or detailed token naming from Figma should be verified again before final visual QA.

## Design Goals

- Build a student-facing learning app that feels clean, modern, and easy to understand.
- Prioritize usability over decorative complexity.
- Keep navigation predictable between public pages and logged-in student pages.
- Make learning actions obvious: browse topic, open material, start exercise, continue progress.
- Reduce ambiguity between `topik`, `materi`, `latihan`, and `simulasi`.
- Prefer `shadcn` as the default UI foundation so components stay consistent and easier to maintain.

## UX Principles

- Use simple language that matches school context.
- Every important action must have a clear CTA.
- Status must be visible: `Preview`, `Premium`, `Published`, `Belum tersedia`.
- Keep page structure stable so users do not need to relearn layout on every screen.
- Empty states must explain what is missing and what should happen next.
- Category exercise and topic exercise must be visually distinguishable.

## Information Architecture

### Public

- `/`
  Landing and preview dashboard
- `/topik`
  Topic catalog
- `/topik/[slug]`
  Topic detail
- `/topik/[slug]/latihan`
  Exercise page dedicated to a topic
- `/latihan`
  Exercise category list
- `/latihan/kategori/[slug]`
  Exercise category detail
- `/materi/[materialId]`
  Material preview
- `/masuk`
  Login
- `/daftar`
  Registration / upsell

### Student

- `/siswa`
  Student dashboard
- `/siswa/topik`
  Topic catalog for students
- `/siswa/topik/[slug]`
  Topic detail for students
- `/siswa/topik/[slug]/latihan`
  Exercise page dedicated to a topic
- `/siswa/latihan`
  Exercise category list
- `/siswa/latihan/kategori/[slug]`
  Exercise category detail
- `/siswa/latihan/[exerciseId]`
  Exercise player
- `/siswa/materi/[materialId]`
  Material viewer

## Navigation Rules

- Top navigation should consistently expose:
  - `Dashboard`
  - `Materi`
  - `Latihan`
  - `Simulasi`
- Student sidebar should consistently expose:
  - `Home`
  - `Materi Saya`
  - `Latihan`
  - `Statistik`
  - `Pengaturan`
- Do not use `Tryout` as a label for routes that actually open `Latihan`.
- If a page is part of the exercise flow, `Latihan` should be the active navigation item.

## Layout System

### Public Content Layout

- Large content canvas with white card container
- Header navigation on top
- Comfortable spacing with strong separation between sections
- Suitable for catalog, topic detail, material preview, and exercise browsing

### Student App Layout

- Fixed top navbar
- Persistent left sidebar on desktop
- Main content area inside a soft background surface
- Primary task area should sit inside rounded white or light panels

## Visual Direction

- Tone: semi-formal, student-friendly, modern
- Style: clean cards, rounded corners, soft borders, bright but not neon
- Visual hierarchy should come from:
  - clear headings
  - section grouping
  - accent colors for actions and statuses
  - controlled use of badges

## Current Token Baseline In Code

These are the implementation tokens already present in `src/app/globals.css` and should remain aligned with the design system unless Figma specifies a newer token set:

- Primary blue: around `oklch(0.51 0.17 248)`
- Accent green: around `oklch(0.9 0.08 145)` with darker foreground green
- Background: warm off-white / soft blue mix
- Border: light cool gray-blue
- Radius base: `0.625rem`
- Font stack:
  - Sans: `Segoe UI`, `Noto Sans`, `Helvetica Neue`, `Arial`, `sans-serif`
  - Mono: `Cascadia Code`, `Fira Code`, `Consolas`, `monospace`

## Core UI Patterns

## Component Policy

- Default to `shadcn` components for UI building whenever the component already fits the need.
- Prefer extending or restyling `shadcn` components instead of creating custom UI from scratch.
- Custom components are allowed when:
  - the pattern does not exist in `shadcn`
  - the layout is domain-specific and composed from smaller `shadcn` primitives
  - Figma requires a distinct structure that cannot be represented cleanly by existing primitives
- Even for custom sections, build them from reusable primitives with `shadcn` style conventions:
  - button
  - card
  - badge
  - input
  - select
  - dialog
  - sheet
  - table
  - tabs
- Avoid mixing too many unrelated UI patterns in one page. If a `shadcn` primitive is available, use that first.

### Page Header

- Back link on detail pages
- Title as strongest visual element
- Meta badges placed before or near title
- Summary text below title
- Quick stats can sit on the right in desktop layout

### Cards

- Rounded corners
- Light border
- Subtle shadow
- Internal spacing should be roomy, not dense
- A card should usually contain:
  - icon or badge
  - title
  - short explanation
  - status or metadata
  - one primary action

### Badges

- `Preview`: blue tint
- `Premium` or `Enrolled`: warm or green tint depending on context
- Category and difficulty badges should be easy to scan but visually secondary to the title

### Empty States

- Use bordered or dashed containers
- Explain why content is empty
- Avoid dead-end wording
- When possible, tell whether the missing item depends on admin publish state

## Domain-Specific UI Rules

### Topic

- Topic pages are for understanding one learning area.
- Topic detail should focus on:
  - summary
  - materials
  - topic-level exercise entry point
  - related category-level exercise entry point

### Material

- Material cards should clearly show:
  - file type
  - access level
  - availability
  - next action

### Exercise

- Exercises must be separated by intent:
  - `CATEGORY`: applies to category + level, not visually attached to one topic
  - `TOPIC`: belongs to a specific topic
  - material-linked exercise: explicitly mention the related material
- On category pages:
  - `CATEGORY` exercises should appear in a dedicated section such as `Latihan Kategori`
  - topic sections should only show `TOPIC` exercises
- On topic pages:
  - provide a dedicated route to exercises for that topic
  - do not hide the entry point behind category-only navigation

## Content Writing Style

- Use Bahasa Indonesia that is natural for school users.
- Keep labels short and direct.
- Avoid technical wording in user-facing copy.
- Suggested language style:
  - `Lihat Materi`
  - `Buka Latihan`
  - `Kembali ke semua topik`
  - `Belum ada latihan yang dipublish untuk kategori ini`

## Accessibility Notes

- Use strong contrast for title text and buttons.
- Important CTAs should not depend on color alone.
- Status badges should include readable text, not icon only.
- Buttons and links should maintain consistent hit area height.
- Avoid crowded text inside stat cards or badges.

## Implementation Scope For Next Iterations

### Must Keep Consistent

- Navigation labels
- Sidebar structure
- Card spacing
- Badge meanings
- Detail page composition
- Empty-state language

### Likely To Evolve

- Final typography scale from Figma
- Exact spacing token values
- Exact icon choices
- Gradient and decorative background treatment
- Motion and transitions

## Suggested Mapping Between Design And Code

- `Public shell`
  - `src/components/layouts/public-content-layout.tsx`
- `Student shell`
  - `src/components/layouts/student-app-layout.tsx`
- `Header / menu data`
  - `src/components/student-dashboard/data.ts`
- `Topic detail`
  - `src/components/public-topic-detail-view.tsx`
  - `src/components/student-topic-detail-view.tsx`
- `Exercise browsing`
  - `src/components/exercise-category-browser.tsx`
  - `src/components/public-topic-exercise-view.tsx`
  - `src/components/student-topic-exercise-view.tsx`
- `Exercise player`
  - `src/components/student-exercise-page.tsx`
  - `src/components/exercise-player-client.tsx`

## Implementation Preference

- For future UI work in `TKA-Mudah`, assume `shadcn` is the default component system.
- New screens should prefer `shadcn` primitives plus project tokens from `globals.css`.
- If a screen needs custom polish, apply it as a layer on top of `shadcn`, not by replacing the whole component approach.

## Design QA Checklist

- Navigation label matches page purpose
- Active state is correct in top nav and sidebar
- Category exercise is not shown as if it belongs to one topic
- Topic exercise page exists and is reachable from topic detail
- Empty states are informative
- CTA labels are consistent
- Card radius, border, and spacing feel uniform
- Mobile layout remains readable without broken alignment

## Next Step

- Re-open this document after direct Figma inspection is available.
- Replace any inferred rules here with exact Figma tokens, spacing values, and section names from the source node.
