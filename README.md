# LiftersTouch Design Tokens & Styling Rules

This project uses a semantic design token system built on Tailwind CSS v4.

## Brand Palette
- **Primary Green** (`--color-brand-primary` / `bg-brand-primary`): `#148A3B` - Used for main structural elements and primary buttons.
- **Soft Green** (`--color-brand-soft` / `bg-brand-soft`): `#3AAE63` - Used for hover states and secondary accents.
- **Gold/Amber** (`--color-brand-accent` / `bg-brand-accent`): `#E6A21A` - Used for "Attention" elements like CTAs and key stats.
- **Background** (`--color-brand-bg` / `bg-brand-bg`): `#FFFFFF` - Main breathing space.
- **Alt Background** (`--color-brand-alt-bg` / `bg-brand-alt-bg`): `rgba(58, 174, 99, 0.06)` - Soft tint for section zoning.
- **Footer Background** (`--color-brand-footer` / `bg-brand-footer`): `#0F5C2A` - Dark green for the site footer.

## Reusable Utility Classes
Use these classes to maintain brand consistency:

### Layout & Sections
- `.container-page`: Standard page width and padding.
- `.section`: Standard white background section with padding.
- `.section-alt`: Soft green background section for visual variety.

### Components
- `.card`: Rounded, shadowed container for content.
- `.btn-primary`: Main green button.
- `.btn-secondary`: Outline green button.
- `.btn-accent`: Gold button for high-priority actions.
- `.stat-value`: Large gold/green text for impact numbers.

## Styling Do's and Don'ts
- **DO** use the semantic `brand-*` colors.
- **DO** use the `@layer components` defined in `src/index.css` for common UI patterns.
- **DON'T** introduce new hex codes or random colors.
- **DON'T** use heavy gradients; stick to solid colors and subtle shadows.
- **DON'T** modify the base spacing/radius tokens without approval.
