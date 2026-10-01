---
version: "superdesign-alpha"
name: "Blueprint-white technical minimalism"
description: "Bright, near-white light-mode-default system with dot-grid technical texture, blue-link ink accents rationed to interactive text, and one dark charcoal band reserved for security/proof content."
colors:
  background: "#FFFFFF"
  surface: "#F7F7F7"
  surface-alt: "#FAFAFA"
  surface-dark: "#1D1D1D"
  text-primary: "#000000"
  text-secondary: "#595959"
  text-muted: "#A7A7A7"
  border: "#E3E3E3"
  accent-link: "#0000EE"
  accent-mint: "#CCDDFA"
typography:
  display-lg:
    fontFamily: "Aspekta 500"
    fontSize: "72px"
    fontWeight: 500
    lineHeight: "1.06"
    letterSpacing: "-2.2px"
  headline-md:
    fontFamily: "Aspekta 300"
    fontSize: "58px"
    fontWeight: 300
    lineHeight: "1.1"
    letterSpacing: "-1.7px"
  body-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "1.6"
  label-md:
    fontFamily: "Inter"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "1.35"
    letterSpacing: "-0.2px"
  body-lg:
    fontFamily: "Inter"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: "1.5"
  label-mono:
    fontFamily: "DM Mono"
    fontWeight: 400
  accent-serif:
    fontFamily: "Times New Roman"
    fontStyle: "italic"
spacing:
  base: "4px"
  gap-sm: "8px"
  gap: "12px"
  gap-md: "16px"
  gap-lg: "32px"
rounded:
  control: "8px"
  card: "12px"
  card-lg: "16px"
  pill: "810px"
  avatar: "447px"
components:
  button-primary-hero:
    background: "#000000 (observed near-black solid)"
    text-color: "#FFFFFF"
    radius: "8px (observed ~6-8px)"
    height: "44px (observed)"
    padding: "12px 24px (observed)"
  button-secondary-hero:
    background: "#F7F7F7"
    text-color: "#000000"
    radius: "8px"
    height: "44px"
    border: "1px solid #E3E3E3"
  button-nav-cta:
    background: "#1D1D1D"
    text-color: "#FFFFFF"
    radius: "8px"
    height: "40px"
  button-utility-ghost:
    background: "transparent"
    text-color: "#000000"
    radius: "40px"
    height: "64px"
    padding: "0px"
  card-feature:
    background: "#FFFFFF"
    radius: "12px"
    padding: "32px"
    border: "1px solid #E3E3E3"
  card-security-dark:
    background: "#1D1D1D"
    radius: "12px"
    padding: "24px"
    border: "1px solid #303030"
  card-chip:
    background: "#F7F7F7"
    radius: "8px"
    padding: "12px 16px"
    border: "1px solid #E3E3E3"
---
# Blueprint-white technical minimalism
Source: https://www.stackai.com/

## Overview
This is a light-mode-default, editorial-technical system: near-white pages (pixel field ~80% white/off-white) carrying dense product-diagram screenshots, punctuated by exactly one dark charcoal band for credentialing content. The aesthetic sits between Swiss/International typographic rigor (tight negative-tracked Aspekta display type, thin rule-underlined eyebrows) and a SaaS-technical register (dot-grid textures behind hero art, floating node-and-edge diagrams standing in for workflow illustration). Color is almost entirely withheld — the palette is structural grayscale plus link-blue — so hierarchy is carried by type weight, size, and whitespace rather than hue.

## Composition
The first screen is a centered, single-column hero: a thin dark announcement strip, then a five-item nav, then an oversized two-line display headline, a two-line gray subhead, a solid-dark primary button beside a light-gray secondary button, and a large bordered product-screenshot panel with soft drop shadow. Below the fold the rhythm alternates: a grayscale logo strip (proof band), a labeled section ("what we do best" eyebrow + rule) introducing a stacked card sequence of workflow illustrations, a 2-up card row, a dark full-bleed security band with a 4-up certification grid, a light platform section with a use-case chip row, a horizontal testimonial/headshot rail, and a final dark CTA band before the footer. The deliberate choice is restraint: color is rationed to one dark band and one link-blue ink, rejecting a saturated gradient-hero approach in favor of letting large-scale typography and technical diagram artwork carry visual interest.

## Colors
`#FFFFFF` is the page background at roughly 61-80% of rendered pixels — this is unambiguously a white-canvas system, not dark-mode. `#F7F7F7` and `#FAFAFA` serve as the card/panel surface tier, barely differentiated from the page to keep elevation subtle (near-flat, bordered rather than shadowed). `#1D1D1D` is reserved as a structural-dark role: it appears only in the security-credential band and the closing CTA band, at roughly 13% of pixels — a deliberate, contained "dark zone" rather than a dark mode. `#000000` and `#1D1D1D` are the text-ink roles for headlines and primary copy; `#595959` and `#A7A7A7` step down for secondary/muted text. `#0000EE` is the single accent — classic hyperlink blue — used sparingly as interactive/link ink, the only saturated hue in the system. `#CCDDFA` appears as a faint pale-blue wash, likely a hover/highlight tint, at negligible area. Nothing else is colored: icons, diagrams, and photography stay grayscale or full-color-photographic (headshots), never tinted to match a brand hue.

## Typography
Display hierarchy is carried by the Aspekta family in two weights: Aspekta 500 at 72px/1.06 with -2.2px tracking for the heaviest hero headline, stepping down to Aspekta 300 at 58px/1.1 with -1.7px tracking for lighter, more open section headlines — the weight drop plus looser tracking signals a secondary tier without changing size much. Body and UI text is Inter throughout: 14px/500 for dense body copy, 18px/400 with -0.2px tracking for labels, and a heavier 20px/500 mode for emphasized body passages. DM Mono appears for numeric/technical labels (index numbers, tokens). Times New Roman in italic is the signature accent — a serif interruption used sparingly, likely on a single emphasized clause within copy, contrasting sharply against the otherwise all-sans, all-geometric system.

## Layout
Content is capped at a 1200px max-width, centered. The clearest measured grid is a 5-column row with 12px gaps holding 6 items in an asymmetric row pattern of full-width / half-and-half / full-width / half-and-half spans — a magazine-style alternating rhythm rather than uniform card grid, used for the certification/credential cards and use-case chips. Card density is low-to-moderate: generous internal padding (32px observed in feature cards), thin 1px hairline borders standing in for elevation instead of heavy shadow. Spacing follows a small, tight base unit (4px) building to 8, 12, 16, 32px gaps — producing a compact, technical density in body regions and much larger whitespace margins around display type. The layout is responsive top-to-bottom stacking: multi-column proof/logo strips and the 4-up credential grid collapse toward single or two-column arrangements at narrower widths.

## Components
- **Navbar**: single row, ~64-72px height, logo mark + wordmark at left, 5 nav items (with two carrying dropdown chevrons) centered/left-of-center, a plain-text "Login" utility link plus a solid dark filled "Get a Demo" button at far right — button radius ~8px, dark fill, white text, this is the nav CTA, not the hero primary.
- **Announcement strip**: full-width thin dark band above the navbar, centered small text plus an arrow-linked "Read More" affordance, single row, no icon beyond the arrow glyph.
- **Hero primary button**: an observed near-black/dark solid rectangle, ~8px corners, sitting directly under the subheadline — the single most emphasized control on the first screen. A lighter gray secondary button (light-gray fill, dark text, matching ~8px radius) sits beside it as the secondary action; it is not a glass control and carries no measured backdrop-filter.
- **Hero product panel**: one large bordered image/screenshot card beneath the CTA row, soft ambient shadow (`rgba(0, 0, 0, 0.25) 0px 0.54px 1.19px -1.25px, rgba(0, 0, 0, 0.22) 0px 2.06px 4.53px -2.5px, rgba(0, 0, 0, 0.09) 0px 9px 19.8px -3.75px`), covering nearly the full content width, showing an application UI screenshot (provider dropdown/list) as its entire content — no text overlay beyond the captured UI.
- **Logo strip / proof band**: one row of 8 grayscale logo marks plus a second shorter row of additional logos beneath, evenly spaced, no cards or borders — pure logotype on white.
- **Workflow illustration card**: a wide bordered panel (radius ~12px, light `#F7F7F7`-adjacent fill, hairline border) containing a heading, a gray descriptive subline, and a node-and-edge diagram illustration (boxes connected by curved lines representing a flow) occupying roughly 60-70% of the card's vertical space; repeats as a stacked sequence, one per section subtopic.
- **2-up card row**: two side-by-side bordered cards of equal width, each with a heading + subline followed by either a chat-transcript mock (avatar rows, message bubbles, one small teal "Approve" pill button and a red "Disapprove" pill button) or a hexagonal provider-icon cluster arranged in a honeycomb layout with one icon highlighted by a ring.
- **Security credential card**: appears ×4 in a single row inside the dark band, each card `#1D1D1D`-family fill, ~12px radius, thin border, containing a top diagonal-hatch texture strip, a centered circular badge/seal icon, a bold heading, a short gray descriptive line, and a footer row pairing a small caps category label (left) with a numeric index like a mono-style tag (right, e.g. "001").
- **Use-case chip row**: horizontal row of 5 compact bordered chips, each with a small icon, a bold short label, and a muted one-line description beneath — chip radius ~8px, light fill, hairline border, uniform width.
- **Testimonial/headshot rail**: horizontal scrolling rail of black-and-white portrait photographs, each full-bleed within its frame, with a bottom-left name/title overlay in white text and a circular white arrow-icon button at bottom-right of each frame; left/right circular nav arrows flank the rail.
- **CTA band (dark)**: full-bleed dark `#1D1D1D` rounded container (radius ~16px), two-column split — left column holds a small underlined eyebrow label, a two-line light headline, a gray supporting line, and a solid white pill/rectangle button (radius ~8px, white fill, dark text); right column holds a large dark 3D-rendered icon badge/token on a perforated dark texture background.
- **Footer**: light background, logo mark top-left, five link columns (Solutions, Resources, Support, Company, Legal) each with a small-caps category label and stacked plain text links, closing row with copyright text, a small "Made by" credit with an inline glyph, and a status-indicator pill plus social icons at far right.

## Graphics & Effects
A dot-grid pattern texture sits behind the hero's product-screenshot panel, giving a technical, blueprint-like ground beneath the floating UI illustration — this dot texture repeats faintly behind the workflow-diagram cards as well. A directional scrim overlays hero/media edges: `linear-gradient(270deg, rgba(29, 29, 29, 0.5) 0%, rgba(102, 102, 102, 0) 10%, rgba(0, 0, 0, 0) 90%, rgba(29, 29, 29, 0.5) 100%)`, applied at the left/right edges of the hero screenshot to fade it into the white page (covers roughly the outer ~10% edges of that one panel, not the full hero). A vertical fade `linear-gradient(rgba(0, 114, 156, 0) 80%, rgb(29, 29, 29) 100%)` darkens the bottom ~20% of a media element into the following dark band, functioning as a section transition, not a page-wide wash. Two small radial highlights — `radial-gradient(21% 21% at 80.2% 19.6%, rgba(255, 255, 255, 0.25) 0%, rgba(18, 18, 18, 0) 100%)` and `radial-gradient(50% 50% at 96.6% 3%, rgb(255, 255, 255) 0%, rgb(107, 129, 156) 59.6689%, rgb(87, 88, 89) 100%)` — sit as small specular highlights on the dark 3D icon badge in the closing CTA band, simulating a glossy metal/chrome token under a single light source; each covers under 1% of the page and should never be scaled to a full background. A perforated/hole-punched dark texture surrounds that same icon badge. Live video surfaces exist in the product-showcase region; use a static gradient or screenshot frame as their stand-in. Elevation throughout is expressed via hairline borders and the one soft multi-layer shadow recipe above, not heavy card shadows — most cards carry a fully transparent shadow (`rgba(0,0,0,0) ...`), meaning flat, border-defined surfaces are the norm.

## Motion
A `blur(10px)` backdrop-filter is available for glass-style overlays (used sparingly, likely on dropdown/tooltip surfaces). Loading/skeleton states use a spinning keyframe (`__framer-loading-spin`) and a shimmer sweep (`shimmer-R2n6req6lp`) for placeholder content. Scroll-triggered reveals and hover micro-interactions are driven by framer-motion, implying fade/slide entrances timed to viewport intersection rather than page-load bursts — consistent with the section-by-section reveal rhythm observed scrolling top to bottom.

## Guardrails
- Never fill the hero background with a saturated gradient — keep it white/near-white; color is confined to the dark security band and closing CTA band only.
- Do not substitute the measured glass/ghost button (`transparent`, 40px radius, 64px height) for the hero primary — that utility button belongs elsewhere; the hero primary is a solid dark rectangle with ~8px corners.
- Keep `#0000EE` reserved for link/interactive text only — never apply it to large fills, buttons, or headlines.
- Preserve hairline borders and near-flat elevation on cards; do not add heavy drop shadows where the measured shadow values are transparent.
- Keep the dot-grid and perforated textures confined to hero/media and the 3D icon badge context — do not spread them across plain text sections.
- Maintain the Times New Roman italic accent as a rare, sparing interruption — never convert body or headline type wholesale to serif.