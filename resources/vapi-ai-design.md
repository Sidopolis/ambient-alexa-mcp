---
version: "superdesign-alpha"
name: "Slate Glass Voice"
description: "Editorial-minimal light system with a photographic full-bleed hero, glass navbar and control chips, near-black content bands, and one rationed emerald accent for calls-to-action and metrics."
colors:
  background: "#FFFFFF"
  background-inverse: "#000000"
  surface-glass: "rgba(0, 0, 0, 0.3)"
  surface-dark-panel: "#09090B"
  text-primary: "#000000"
  text-on-dark: "#FFFAEA"
  text-ink-alt: "#111013"
  accent: "#00CD8F"
  border-hairline: "#FFFFFF"
typography:
  display-lg:
    fontFamily: "avantt"
    fontSize: "80px"
    fontWeight: 600
    lineHeight: "0.9"
    letterSpacing: "-4px"
  headline-md:
    fontFamily: "avantt"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: "1"
    letterSpacing: "-2.3px"
  body-md:
    fontFamily: "avantt"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "1.4"
  label-md:
    fontFamily: "avantt"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: "1"
    letterSpacing: "-1.6px"
  body-runtime:
    fontFamily: "seasonSans"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "1.4"
  accent-mono-label:
    fontFamily: "Geist Mono"
    fontWeight: 500
    fontSize: "13px"
    letterSpacing: "0.08em"
    note: "eyebrow / all-caps kicker face"
spacing:
  base: "8px"
  gap: "16px"
  gap-lg: "24px"
  micro: "4px"
  control-pad: "10px"
  section-padding: "96px"
rounded:
  control: "8px"
  control-tight: "4px"
  card: "12px"
  square: "4px"
  pill: "9999px"
components:
  button-hero-primary:
    background: "#FFFFFF (observed, near-white solid)"
    text-color: "#000000 (observed)"
    radius: "~6px (observed)"
    height: "~40px (observed)"
    note: "the single filled button under the hero headline; highest-contrast control on the first screen"
  button-glass-utility:
    background: "rgba(255, 255, 255, 0.1)"
    text-color: "#FFFFFF"
    radius: "8px"
    height: "36px"
    padding: "8px 14px"
  button-solid-nav-cta:
    background: "#FFFFFF"
    text-color: "#000000"
    radius: "8px"
    height: "36px"
    padding: "8px 14px"
  button-glass-console-block:
    background: "rgba(255, 255, 255, 0.1)"
    text-color: "#FFFFFF"
    radius: "0px"
    height: "50px"
    padding: "16px"
    hover-background: "rgba(255, 255, 255, 0.16)"
  button-nav-link:
    background: "transparent"
    text-color: "#FAFAFA"
    radius: "0px"
    height: "36px"
    padding: "0px"
  button-navbar-cta:
    background: "#00CD8F"
    text-color: "#111013"
    radius: "4px"
    height: "40px"
  card-editorial-band:
    background: "transparent"
    radius: "0px"
    padding: "60px 72px 36px"
  card-icon-feature:
    background: "transparent"
    radius: "0px"
    padding: "96px 0px 0px"
  card-glass-panel:
    background: "rgba(0, 0, 0, 0.3)"
    backdrop-filter: "blur(40px)"
    radius: "12px"
    padding: "16px"
  card-text-plain:
    background: "transparent"
    radius: "0px"
    padding: "0px"
---
# Slate Glass Voice
Source: https://vapi.ai

## Overview
This is a light-mode-default editorial system that borrows glassmorphic chrome for its navigation and floating controls, then spends the rest of the page in flat black-on-white minimalism, punctuated by two near-black photographic bands. The carrying idea is contrast of register: a huge cinematic photographic hero with frosted glass controls floating over it, followed by quiet, generous white space with tight display type, then a sudden drop into black sections that hold logo marks and gradient banners. The accent (`#00CD8F`) is a single emerald note reserved for the navbar CTA and one closing CTA — never a background color, always a small filled shape.

## Composition
The first screen is a full-bleed photographic hero (a documentary-style human portrait, warm and desaturated) with a thin announcement bar above the navbar, a glass navbar, an oversized display headline in the left-center, a short support line, one solid CTA, and a glass input-style control row below it — a deliberate choice to treat the hero as a live console rather than a static marketing banner, rejecting the more common approach of stacking a second CTA beside the first. Below the fold the page shifts to a spacious, low-density white canvas: a quote/logo-strip band, then alternating text-left/media-right rows (a dashboard screenshot on a warm dark card), a horizontally scrolling integration icon rail on black, a two-column enterprise capability grid, a stacked pair of case-study rows, a two-up card row, a 5-up statistic row, and finally a green gradient CTA band into a black footer. Section padding is a consistent 96px, giving each band clear separation despite the density change between white and black zones.

## Colors
White (`#FFFFFF`) and off-black (`#000000`) dominate the pixel field (~48% and ~16% combined with `#F0F0F0` at ~14%), confirming this is a light-primary system with black used structurally for full sections, not accents. `#001818` and `#181818` (~4–3%) mark the dark photographic/gradient bands (integration rail, CTA band, footer). The emerald `#00CD8F` is the sole saturated hue and is rationed to under 1% of pixels: the navbar CTA fill and one CTA button in the closing band. Text ink alternates by surface — `#000000` on white sections, `#FFFAEA`/`#FFFFFF` on dark and photographic sections. Borders are near-invisible hairlines in `#FFFFFF` at low opacity, used only inside glass chrome. Nothing else carries color: icons, dividers, and the enterprise-grid iconography stay monochrome.

## Typography
`avantt` is the display/label workhorse: an 80px/600, lh 0.9, ls -4px display size for hero and closing headlines, dropping to 40px/500 for both mid-page section headings and label-style numerals (ls -2.3px and -1.6px respectively) — the same face carries both huge display type and large numeral/stat figures, unified by tight negative tracking throughout. Body copy runs on `seasonSans` at 16px/400 for prose blocks and on `avantt` at 16px/500 for tighter UI-adjacent copy (support lines, card labels). `Geist Mono` appears as the small all-caps eyebrow/kicker above section headings — the signature accent face, used sparingly and always uppercase. `Helvetica` and `Inter` sit underneath as system fallbacks for incidental UI text (form placeholders, badges).

## Layout
Content is capped at a 1296px max-width with 96px section padding, built on an 8px base spacing unit (4/8/16/24px steps). The enterprise-capability section is a 2-column icon-label grid (measured rows of 89%/89% width), reading as two clean columns of stacked feature rows rather than a card grid. The dashboard/glass-panel showcases use a near-full-bleed single card per row (rows of 98%/98%), i.e., one wide glass panel per section, not a multi-card grid. The case-study/logo pairing below runs as a 2-up card row (two equal-width dark photographic cards side by side). The closing statistic band is a 5-column single-row list separated by hairline vertical dividers, each column left-aligned under its own numeral — a **stat/numeral row**, not a card. The integrations band is a horizontal scrolling icon rail (a **scrolling rail** pattern) rather than a wrapped grid. No masonry or bento asymmetry appears anywhere; every grid is uniform-row, low-column-count, and generously gapped — a magazine-style rhythm of full-width text bands interrupted by exactly one wide media card per section.

## Components
- **Navbar**: sticky, 72px tall, `rgba(255, 255, 255, 0.12)` fill with `backdrop-filter: blur(40px)`, 10 items total (logo mark, ~5 nav links with two dropdown carets, a Login button, and the primary CTA). Its CTA is solid `#00CD8F` fill, `#111013` text, 4px radius, 40px height — the only saturated-fill control in the entire navbar. A secondary "Login" button sits directly left of it as an outline/ghost style. The logo is a wordmark with a small angular bird-wing glyph, rendered in solid black on light chrome.
- **Hero primary button**: an observed near-white solid pill/rounded-rect beneath the headline, ~6px corners, dark text — the highest-contrast, most emphasized control on the first screen. This is distinct from every measured glass button.
- **Hero console control row**: a glass dropdown/select paired with a filled dark pill-shaped "call" trigger sitting directly under the primary CTA — reads as a live interactive console, glass fill, small caption below it in muted white.
- **Announcement bar**: full-width band above the navbar carrying a moving green gradient/light-streak texture with a small underlined link-style CTA at the right end.
- **Quote/logo-strip band**: one testimonial block (small circular avatar, name/title in small caps-style secondary text, quote in body copy with bold inline emphasis) paired beside a 2×2 wrapped grid of monochrome partner logo marks — appears once, directly under the hero.
- **Alternating media rows (×2)**: text column (eyebrow in mono label face, `headline-md` heading, body paragraph) beside a single large image/dashboard-screenshot card; card fill is a warm dark photographic/gradient surface, 12px-radius rounded corners, screenshot occupies the full card with a dark UI overlay showing numeral stat tiles and small chart sparklines across the top and three mini agent-status cards below.
- **Enterprise capability grid**: 2-column × multiple-row icon-led list (icon, bold label line, 2-line description), transparent background, no card chrom, 96px top padding per row — reads as a plain list, not bounded cards.
- **Integration icon rail**: horizontal scrolling row of square glass icon tiles (rounded-corner squares, dark fill, single brand glyph centered) on a full-bleed black band, paired with a left-side eyebrow/heading and one outline button.
- **Case-study media card (large, single per row)**: full-width dark photographic image card, rounded ~12px corners, logo wordmark + eyebrow + quote + avatar/name caption on the left half, a play-button affordance and caption overlay in the bottom-right of the image on the right half.
- **Case-study card pair (2-up row)**: two equal-width dark photographic cards side by side, each with a small logo mark, a bold one-line stat headline, an outline "read case study" button, and one or two pill-shaped tag chips in the bottom-left corner, dark translucent chip fill with hairline border.
- **Stat/numeral row**: 5-column single row, each column a large `avantt` numeral (e.g., scale matching `label-md`/`headline-md`) with a small caption beneath, separated by thin vertical hairline dividers — sits on plain white background.
- **CTA band**: full-bleed green gradient/light-streak background carrying a large two-line display headline (white text) and two buttons side by side: one solid emerald `#00CD8F` fill pill/rounded-rect, one solid white fill pill/rounded-rect with dark text — the pairing of accent-fill and neutral-fill CTA.
- **Footer**: `#000000` background, logo mark top-left, 14 links total organized into two labeled columns (mono-label small-caps headers), legal line and 3 social icons along the bottom edge.

## Graphics & Effects
Two scrims cited in the evidence — `linear-gradient(rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.45) 100%)` and `linear-gradient(rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.18) 100%)` — sit directly over the hero photograph and the large case-study photographic card respectively, darkening the bottom of each image for text legibility; each covers only its host image, not the full viewport. A third gradient, `linear-gradient(rgb(31, 31, 35) 40px, rgba(0, 0, 0, 0) 100%)`, is a tiny top-edge fade inside a dark panel component (under 1% of page area). The announcement bar and the closing CTA band both carry a diagonal streaked green light-texture — this reads as a motion-blur/light-leak graphic, not a solid fill; treat it as a bespoke animated or pre-rendered texture, not a CSS gradient, when rebuilding. Glassmorphism governs the navbar (`rgba(255,255,255,0.12)` + `blur(40px)`) and the dashboard showcase panel (`rgba(0,0,0,0.3)` + `blur(40px)`), both with hairline white borders. A soft ambient shadow (`rgb(204, 204, 204) 0px 0px 2px 2px`) wraps small floating chrome elements. Live video elements back at least two sections (the hero and the closing CTA band); use a static frame of a dark, softly blurred texture as a stand-in.

## Motion
Interactive elements transition on `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` for general state changes, `background-color 0.2s ease-out` for hover fills, and `transform, translate, scale, rotate 0.2s cubic-bezier(0.4, 0, 0.2, 1)` for pressed/active micro-movements; a slower `transform 0.4s ease` governs larger panel transitions. Named keyframes (`delay-overflow`, `osano-load-scale`, `card-spotlight-parallax`, `card-spotlight`, `sales-pulse`, `fhero-flap-in`) point to a system with a subtle parallax spotlight sweep across card surfaces, a pulsing emphasis on one stat or CTA, and a flap/reveal entrance for hero elements. CSS scroll-driven animations trigger content and imagery into view as sections enter the viewport — treat every alternating media row and stat row as scroll-triggered fades/slides, not static-on-load content.

## Guardrails
- Never fill the full hero viewport with the green gradient — it belongs only to the thin announcement bar and the closing CTA band.
- Do not use the glass button values (`rgba(255,255,255,0.1)`, 8px or 0px radius) for the hero's primary CTA — that button is a solid near-white fill with ~6px corners.
- Keep all mid-page section backgrounds white/near-white; black is reserved for the integration rail, footer, and CTA band only.
- Preserve square (0px radius) corners on editorial text-band cards and icon-feature rows — do not round them like the glass panels.
- Keep the emerald accent confined to the navbar CTA and one CTA-band button; never tint large surfaces with it.
- Maintain the tight negative letter-spacing on all `avantt` display/label sizes — loosening it breaks the system's signature compression.