# Zluri_App
# Zluri-Style Employee App Catalog

A clean, minimal, responsive Employee App Catalog that lets employees discover, launch, and request access to enterprise apps. Includes transparent access status, a two-step request flow (reason + tier with approver/SLA inline), a personal dashboard, and a lightweight AI assistant for natural‑language help.

## Features

- Catalog & discovery
  - Global search over names, tags, and purpose; guided filters (Department, Function, Access status, Popularity).
  - Curated role-based Starter Packs; responsive cards; high-contrast UI.
- App tiles & details
  - Tiles: logo, purpose, owner, compliance badges, status chip (Assigned/Request/Pending/Declined), Launch/Details.
  - Detail drawer: features, access requirements, license/cost, similar approved alternatives.
- Requests & tracking
  - Short request modal (reason, tier) with approver and SLA shown upfront.
  - Pending requests list with status, timestamps, comments.
- Personal dashboard
  - “Your Apps” grid, “Pending requests,” “Recently used,” role-change nudges.
- AI assistant
  - Natural-language prompts: “Need a CRM,” “Do I have Salesforce?,” “Request Jira,” “Track my request.”
  - Can open details, start requests, or trigger launches when eligible.
- Accessibility & mobile
  - Logical focus order, ARIA labels, visible focus, high contrast, viewport meta.
  - Mobile chip filters and full-height drawers; keyboard-friendly interactions.

## Tech Stack

- Vanilla HTML, CSS (custom properties, Grid/Flex), JavaScript (modules).
- In-memory demo data (users, apps, requests, events); sessionStorage for login state.
- Simulated SSO flows (IdP-initiated SAML/OIDC) with educational popups and safe redirects.

## Getting Started

1. Clone or download this repository.
2. Open `index.html` in a modern browser (Chrome/Edge/Firefox).
3. Log in with a demo user:
   - `admin@company.com` (admin role)
   - `john.doe@company.com` (employee role)
4. Try:
   - Search “CRM” or “Communication” and apply filters.
   - Open app details; click Launch (if Assigned) or Request (if not).
   - Check the dashboard’s “Pending requests” and “Recently used.”
   - Click the bottom-right chatbot bubble for guided actions.

Tip: If Continue does nothing, ensure JavaScript is enabled and use the exact emails above. Refresh once if needed.

## Project Structure

- `index.html` — App shell: login, dashboard, drawers/modals.
- `style.css` — Design system (colors/typography/spacing), responsive layout, states.
- `app.js` — State, rendering, events, login/session, SSO simulations, requests.
- `chatbot.js` — Floating chat UI, simple intent handling, catalog actions.

## Demo Data

- Users: Admin and Employee with roles/departments/groups.
- Apps: Slack (SAML), Google Workspace (SAML demo / OIDC later), Salesforce (SAML), Microsoft 365 (linked SSO).
- Requests: Sample pending/approved entries (e.g., Jira) for status/timeline.
- Events: Page views, searches, details, requests, launches (for metrics demos).

## Key Interactions

- Search/filters: Debounced + combinable filters; helpful empty states.
- Tiles: Assigned → Launch; Request → modal (reason/tier + approver/SLA).
- Detail drawer: Purpose, features, requirements, alternatives; Launch/Request.
- Chatbot: “Need project tracking” (suggest Jira), “Do I have Salesforce?” (status), “Track my Jira request” (ETA).

## Accessibility

- Keyboard: Tab/Shift+Tab navigation; Enter for primary actions; Escape closes modals/drawers.
- ARIA: Roles/labels on interactive elements; visible focus rings.
- Contrast: Near-black text, high-contrast chips/buttons; clear hover/focus states.

## SSO Notes (Demo)

- Slack (SAML): EntityID `https://slack.com`; ACS `https://<workspace>.slack.com/sso/saml`; NameID=email (demo assertion).
- Salesforce (SAML): Audience/ACS = My Domain; NameID=email or Federation ID (consistent choice).
- Google Workspace: SAML demo or safe redirect; OIDC upgrade path documented for production.
- Microsoft 365: Linked SSO now (`https://www.office.com`); full SAML/OIDC later.

## Metrics (Suggested)

- Adoption: Catalog Engagement Rate, Launch Enablement Rate.
- Business Impact: IT Ticket Deflection, Time to Access (median hours).
- Discovery: Search Success, Zero-Result Rate, Alternative Acceptance.
- Chatbot: Share of chat-assisted actions.

## Troubleshooting

- Login unresponsive: Enable JS; use exact demo emails; reload once.
- Pop-ups blocked: Allow pop-ups for simulated launches; retry.
- Mobile layout issues: Turn off “Request desktop site”; clear cache.

## Roadmap

- Real IdP integration (metadata import, signed assertions, JWKS).
- Provisioning/deprovisioning connectors on approval/role change.
- Policy rules (risk scoring, auto-approvals, cost thresholds).
- Built-in analytics dashboard for the above metrics.

## License

Demo project for case-study and educational use. Add or replace with a LICENSE file for distribution.
