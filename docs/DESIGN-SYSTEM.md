# Leanova interface guidelines

Preserve the supplied logo and charcoal/gold identity. Use purposeful information hierarchy and real business content. Do not add client badges, invented metrics or decorative controls.

| Element | Guideline |
| --- | --- |
| Primary | Gold #D8B45C on charcoal #0D1014 |
| Secondary | Silver-grey text #B9BFC7, surfaces #14181E, borders #30353D |
| Typography | Local system sans-serif; no blocking third-party font import. Headings 550–600 weight, body 400 |
| Scale | Body 17px; small text about 14–15px; headings responsive from 32px to about 54px |
| Rhythm | 8 / 16 / 24 / 32 / 48 / 64px; responsive section spacing |
| Buttons | Gold primary, outlined secondary; descriptive action labels; visible 3px keyboard focus |
| Cards | One thin border, restrained 4px radius, no decorative shadow; reserve grids for meaningful parallel content |
| Navigation | Named landmark, active-page state; mobile disclosure at 58rem; visible fallback without JavaScript |
| Layout | Maximum 76rem wrapper; safe minimum grid widths; 58rem stacked media, 36rem compact layouts |
| Details | Native details/summary for service tools and FAQs; keyboard usable without custom JavaScript |
| Forms | Future: visible labels, field-level errors, live submission feedback; success only after confirmed delivery |
| Icons | Small supporting symbols, hidden from assistive technology when redundant; labels carry meaning |
| Illustrations | Code-native diagrams explain real relationships. Prefer verified operational imagery; never portray stock imagery as client evidence |
| Motion | Optional short state transitions only; respect reduced-motion preference |

All nine HTML pages retain the existing component classes and routes. Shared CSS and a small navigation script provide consistent behavior. Repeated header/footer HTML is intentionally retained for buildless hosting; a later template build can remove duplication if the team approves that architecture change.
