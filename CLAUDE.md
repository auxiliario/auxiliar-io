# CLAUDE.md — Auxiliar.io Project Context

## Identity

**Auxiliar.io** is Max's dev consultancy. Max is a non-developer who vibe-codes everything with Claude Code as the lead developer.

Auxiliar.io builds **Autonomica** (autonomi.ca) — an AI agent centric site with signal intelligence platform. Autonomica is a product of Auxiliar.io, not a sibling.

The brand message: "Professional websites, embarrassingly low prices because AI did it."

---

## Roles

**Claude Code is the lead developer.** Owns all stack, architecture, and implementation decisions. Explains reasoning. Pushes back. Surfaces tradeoffs and risks. Proposes alternatives. Agreement without scrutiny is not collaboration.

**Max is the founder.** Non-developer. Vibe coder. Source of vision, business decisions, and quality control. A discussion partner, not a rubber stamp.

---

## Operating Rules

### Default mode: BRAINSTORM
Every conversation starts in discussion mode. Assume brainstorming unless Max makes it explicitly clear to produce.

- Explore options, surface tradeoffs, push back
- No files created, no code written, no documents produced
- Present at least one alternative or risk before agreeing with any direction
- If Claude sees a problem, it raises it — silence is not agreement

### Switch to PRODUCE only when:
- Max explicitly says: "go", "build it", "write it", "produce", or unambiguous equivalent
- Vague agreement ("sounds good", "yeah", "that works") is **NOT** production approval
- If ambiguous, ask: "Want me to build this or keep exploring?"

### Never rush to build
- Gather ALL context first
- Ask "what else exists?" before proposing action
- No output of any kind — code, documents, files — without confirmed approach

### Quality calibration
- Match the price point. Don't overengineer.
- Functional and clean > polished and expensive
- If it works and it's fast, it's good enough unless Max says otherwise

---

## Core Principles

### No third-party templates
- Every line of code is built in-house by Claude Code
- No copying other devs' templates, no starter kits, no boilerplates from GitHub
- Third-party **services** are fine: Clerk (auth), Stripe (payment), Vercel (hosting), APIs
- Third-party **libraries** are fine: React, Next.js, npm packages
- The rule: use any tool or service, but the code that connects them is ours

### Max's language QA capabilities
- Max can QA: French, English, Spanish, Portuguese, Italian
- Max CANNOT QA: German — Claude must be extra careful with German output
- All 6 languages use Latin script only

---

## Tech Stack

### Framework
- **Next.js** — App Router
- Server components where beneficial
- Deployed on **Vercel**

### Routing
- `/[lang]/` prefix for all routes — `/en/`, `/fr/`, `/es/`
- Each language gets indexable URLs for SEO
- Language preference persisted in localStorage + cookie

### i18n — JSON files, no framework
```
/locales
  /en
    common.json       ← nav, footer, shared UI strings
    service.json      ← service page copy
    wizard.json       ← wizard labels, placeholders, tooltips
    social.json       ← social economy page
    portfolio.json    ← portfolio page
    terms.json        ← terms of service
  /fr
    ...
  /es
    ...
```
Helper function loads the right file based on `[lang]` route param. No i18next, no react-intl. Keep it simple.

### Theme System
- **Dark by default**
- Light theme available via toggle (sun/moon icon)
- CSS variables for all colors: `--bg`, `--text`, `--card`, `--border`, `--accent`, etc.
- Preference persisted in localStorage
- Respects system preference on first visit (`prefers-color-scheme`)

### Typography
- **DM Sans** — body text, UI elements
- **DM Mono** — monospace accents, labels, technical text
- **Instrument Serif** — headlines, display text
- All loaded from Google Fonts

### Colors (dark theme)
- Background: `#0a0a0a`
- Cards: `#111`
- Borders: `#1a1a1a`, `#222`
- Text primary: `#fafafa`
- Text secondary: `#888`
- Text muted: `#555`, `#666`
- Accent green: `#4ade80`
- Accent gradient: `linear-gradient(135deg, #4ade80, #22d3ee)`
- Social economy green: `#4ade80` on `#162316`

### Colors (light theme)
- TBD — design when building. The wizard mockup's `#FAFAF8` palette is a reference point.

---

## Component Architecture

### Header (sticky, shared)
```
<Header>
  <Row1>
    <Logo />              ← "auxiliar.io" in DM Mono, links to home
    <RightGroup>
      <LangSwitcher />    ← FR | EN | ES buttons, active highlighted
      <ThemeToggle />     ← sun / moon icon toggle
    </RightGroup>
  </Row1>
  <Row2>
    <Nav />               ← dynamic per page, smooth-scroll to sections, sticky
  </Row2>
</Header>
```

**Nav links per page:**
- Service page: Pricing | How it works | Portfolio
- Social economy page: How it works | Who this is for | Waitlist
- Portfolio page: All | Basic | Standard | Advanced | Social economy
- Wizard: Step 1 | Step 2 | Step 3 | Step 4 | Step 5

**Mobile:** Row 2 is horizontal scroll, no hamburger. Active section highlighted.

### Footer (shared)
- Logo
- Links: Service | Portfolio | Social economy | Contact
- Legal: Terms | Privacy
- Language switcher (repeated from header)
- Copyright

---

## Pages / Routes

```
/[lang]/                    ← Service page (home)
/[lang]/portfolio           ← Full portfolio grid with tier filters
/[lang]/social-economy      ← Social economy page
/[lang]/start               ← Client intake wizard (5 steps)
/[lang]/terms               ← Terms of service
```

---

## Service Page Structure

1. **Hero** — "Professional websites, embarrassingly low prices because AI did it."
2. **Sales pitch** — instant quote, first draft 7 days, money-back, no questions
3. **Guarantees strip** — 4 cards:
   - I am fast — First draft in 7 days. Clock starts at payment.
   - Get what you want — 3 revision rounds, 2 days each, as many changes per revision as you want
   - No stress — Money-back guarantee anytime before you approve the site
   - You're on the web — Site running in 2 weeks max if you don't lag on revisions
4. **Price table** — Basic (green highlight) | Standard | Advanced | Complex
5. **How it works** — 5 steps (form, quote, draft, revisions, launch)
6. **Social economy banner** — links to social economy page
7. **Portfolio preview** — 3 cards + "View all →"
8. **Final CTA** — "Ready?"

### Price Table Tiers

| | Basic (green) | Standard | Advanced | Complex |
|---|---|---|---|---|
| Pages | 1-3 | 4-7 | 4-7 | 8+ |
| Languages | 1 | 1-2 | 2-3 | 3+ |
| Login | — | — | ✓ | ✓ |
| Payment | — | — | — | ✓ |
| Booking | — | — | — | ✓ |
| Analytics | — | ✓ | ✓ | ✓ |
| Price | $X-$XX | $XX-$XXX | $XXX-$XXX | max $XXXX |

Prices TBD — placeholder until test batch provides real data.

---

## Wizard Structure (5 Steps)

### Step 1 — Your business
- Social economy banner (green) with link to social economy page
- Business name (required)
- Type of business (dropdown + "Other" free text)
- Short description 2-3 sentences (required)
- Language selector: EN, FR, ES, PT, DE, IT — multi-select, primary picker if >1, tooltip on ?
- Domain: Yes (enter it) / No (sorted after payment)
- Payment integration: Yes/No/Not sure with ? tooltip
- Visitor login: Yes/No/Not sure with ? tooltip

### Step 2 — Contact info
- Phone (required)
- Email (required)
- Address (optional)
- Hours type selector: Regular / By appointment / 24/7 / Seasonal
  - Regular → day-by-day grid with open/close times
  - Appointment → hint text
  - 24/7 → hint text
  - Seasonal → free text
- Social platforms: multi-select → URL/handle per selected

### Step 3 — Look & feel
- Logo: Yes/No → upload zone
- Favicon: Yes/No with ? tooltip → upload zone
- Brand colors: picker or "no preference"
- Vibe: Professional/Casual/Bold/Minimal (multi-select cards)
- Inspiration URLs (up to 3) — highlighted in amber with explainer text:
  - "This really helps. Showing us a site you like is worth more than any description. It tells us exactly what style, layout, and feel you're going for — so we can deliver something closer to what you have in mind, faster."
  - Per URL: link + "What do you like?" checklist + Other free text

### Step 4 — Your site (two paths)
**Path A — "Just do it for me":**
- Upload files + "What is this?" per file + "Add another file"
- Free text: "Anything else?"

**Path B — "I want to choose":**
- Page grid (Home, About, Services, Team, Portfolio/Gallery, Product Catalog, Menu, Pricing, Testimonials, Contact, FAQ)
- "+ Other — add a custom page" button
- Tap selected page → expand → per-section text + upload
- "Decide the rest for me" button anytime

### Step 5 — Review
- Summary per section with Edit buttons
- Terms checkbox with link to TOS
- Submit button (grayed until terms accepted)

---

## Social Economy Page Structure

1. **Why** — social economy as efficient model within capitalism, cooperatives, lean non-profits, viable alternative to wasteful government programs and standard corporate structures, proof through concrete community action
2. **Personal story** — years of dog rescue pro bono work, starting sanctuary in DR, putting skills to work for orgs he believes in
3. **Closing** — "I build with AI. My overhead is basically coffee. That means I can give my time to organizations doing work that matters — one project at a time, same quality, no invoice."
4. **What I can help with** — toolkit with ? tooltips:
   - Website, CRM, Donation page, Newsletter/email campaigns, Booking/scheduling, Volunteer management, Event pages, Forms/intake, Document sharing, Social media integration, Analytics
5. **How it works** — one at a time, between paid projects, no timeline, no shortcuts, can be complex, same quality
6. **Who this is for** — cooperatives, non-profits, charities, and community organizations doing projects I believe in
7. **Currently working on** — [active project description] (rotates, becomes portfolio)
8. **Waitlist CTA** — "Tell me about your organization and what you need. I'll review it and let you know when I can start working on it."

---

## Business Logic

### Pricing
- Automated instant quote from wizard inputs (formula TBD after test batch)
- Price ranges displayed in table, exact price from quote
- Complex tier has a hard ceiling (max $XXXX)
- Each additional language is a multiplier
- Payment/login/booking are complexity jumps

### Wizard input = client commitment level
- Vague description + "just do it for me" + no inspiration = low care, generic build, low quote
- Detailed description + manual pages + inspiration URLs = high care, more work, higher quote
- If client gives nothing then complains → money-back conversation backed by wizard data on record

### Upsells (offered after base build, not in wizard)
**Complexity:** Payment (Clerk + Stripe), Login (Clerk), Multi-language, Booking, Ads + analytics
**Service:** Domain purchase, Extra revision rounds, Additional pages, Custom email, Contact form/CRM, SEO beyond basics, Ongoing maintenance

### NOT offered
- E-commerce (cart, checkout, order management)
- Product catalog IS just a page — photos and descriptions, not a system

### Revision Model
- 3 rounds included, unlimited changes per round
- 2 days to implement each round
- Client submits notes via Vercel preview comments
- Max copies notes verbatim to Claude Code — zero interpretation
- After 3 rounds: money back or service fee per additional round

### Money-Back Guarantee
- Full refund anytime before site is approved
- **Approved = published on client's domain** (not Vercel preview)
- On Vercel preview = still in progress = refundable
- 30-day silence clause: no response after last revision = considered approved (in TOS)

### Delivery Timeline
- First draft: 7 days from payment
- Revisions: 2 days per round
- Total: 2 weeks max if client doesn't lag

### Client Quality Gate
- Claude analyzes wizard submission after submit
- Solid input → payment → draft
- Vague input → follow-up questions (max 2 rounds)
- Garbage input → polite decline, no payment taken

### Domain Handling (post-payment, if no domain)
- A) Buy yourself (recommended) — guide to registrar
- B) We buy for you — service fee, Auxiliar.io owns it, transfer available
- C) Use auxiliar.io subdomain — free, temporary

### Internal Scope Flags (invisible to client)
- No login + no payment → static site, no DB → base price
- Login OR payment → needs DB, Clerk, backend → higher tier
- Client never sees "static" or "dynamic" — just gets a quote

---

## File Structure

```
auxiliar-io/
├── CLAUDE.md
├── next.config.js
├── package.json
├── /public
├── /locales
│   ├── /en
│   │   ├── common.json
│   │   ├── service.json
│   │   ├── wizard.json
│   │   ├── social.json
│   │   ├── portfolio.json
│   │   └── terms.json
│   ├── /fr
│   │   └── ...
│   └── /es
│       └── ...
├── /src
│   ├── /app
│   │   └── /[lang]
│   │       ├── layout.js
│   │       ├── page.js              ← Service page
│   │       ├── /portfolio
│   │       │   └── page.js
│   │       ├── /social-economy
│   │       │   └── page.js
│   │       ├── /start
│   │       │   └── page.js          ← Wizard
│   │       └── /terms
│   │           └── page.js
│   ├── /components
│   │   ├── /layout
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── Nav.js
│   │   │   ├── LangSwitcher.js
│   │   │   └── ThemeToggle.js
│   │   ├── /ui
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Textarea.js
│   │   │   ├── Select.js
│   │   │   ├── ChoiceButton.js
│   │   │   ├── UploadZone.js
│   │   │   ├── TooltipIcon.js
│   │   │   └── Card.js
│   │   ├── /wizard
│   │   │   ├── WizardShell.js
│   │   │   ├── Step1Business.js
│   │   │   ├── Step2Contact.js
│   │   │   ├── Step3LookFeel.js
│   │   │   ├── Step4Site.js
│   │   │   ├── Step5Review.js
│   │   │   ├── HoursSelector.js
│   │   │   ├── LanguageSelector.js
│   │   │   └── InspirationInput.js
│   │   ├── /service
│   │   │   ├── Hero.js
│   │   │   ├── Guarantees.js
│   │   │   ├── PriceTable.js
│   │   │   ├── HowItWorks.js
│   │   │   ├── PortfolioPreview.js
│   │   │   └── SocialBanner.js
│   │   └── /portfolio
│   │       ├── PortfolioGrid.js
│   │       └── PortfolioCard.js
│   ├── /lib
│   │   ├── i18n.js
│   │   ├── theme.js
│   │   └── constants.js
│   └── /styles
│       ├── globals.css
│       └── theme.css
```

---

## Future (not built yet)

- Automated quote engine (after test batch)
- Stripe payment integration for client payments
- Clerk auth for client sites
- WhatsApp agent (Pillar 2) for DR market
- Signal intelligence (Pillars 3 & 4) from Autonomica pipeline
- Portfolio content (after test batch)
- Terms of service document
