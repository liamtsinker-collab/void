# Void — monetization and business plan (draft)

All numbers here are assumptions to be tested, not facts. Prices are placeholders.

## Principle
The core loop (quests, XP, ranks, gear, map) stays **free**. People pay for **depth and identity**, never for the basic ability to find out what pulls them. A directionless 20-year-old should never hit a paywall before the app has proven itself.

## The four revenue streams

| # | Stream | What it is | Placeholder price | Status |
|---|--------|------------|-------------------|--------|
| 1 | **Quest packs** | Themed sets of 8+ quests (Builder Path, Hands & Trades, Creative Paths). More coming (fitness, military, tech, health care). | $4.99 each | Built (locked in Shop) |
| 2 | **Direction Report** | The full version of the report: flow moments, what drains you, paths worth researching, next 3 quests, a question to sit with. Free summary always shown. | $7.99 one-time (or included in an annual plan later) | Built (rule-based) |
| 3 | **Looks** | Premium Void designs (Specter, Titan) and a colour pack. Cosmetic only. | $2.99 per design, $0.99 colour pack | Built |
| 4 | **Void for Programs (B2B)** | Sold to organisations that serve young adults: universities and careers services, trade schools, bootcamps, youth and employment programs, apprenticeship providers. | Per seat or flat per program | Not built (needs accounts) |

### Why these four
- Packs and the report are **content and insight**, which is what the user actually wants. They are not a subscription for a habit loop.
- Looks monetise attachment to the character without touching the core.
- B2B is the highest-value stream per customer. One program can equal hundreds of consumer purchases, and the buyer (an adviser with a budget) is different from the user.

## Rough maths (assumptions, to be tested)
- Consumer: if 4% of users buy something and average spend is about $9, then 10,000 users gives about $3,600 and 50,000 users gives about $18,000. Consumer alone is a long road to six figures.
- B2B: a program of 200 students at $4 per seat per year is $800. Twenty programs is $16,000. Flat pricing of $1,000 to $3,000 per program per year with 40 programs is $40,000 to $120,000.
- The realistic six-figure path is **B2B plus consumer together**, with consumer acting as the proof and the funnel.

## Void for Programs: what it would be
- An adviser creates a **cohort** and gets a join code. Students sign up with the code (18+ only at first).
- Students use the normal app. Advisers see an **aggregate dashboard**: which fields the cohort is pulling toward, completion rates, flow moments. Individual notes stay private unless the student chooses to share.
- Advisers can **assign quests** (for example: "this week, everyone does the career interview quest").
- Exportable summary for funders and reporting.
- Privacy first: students control what is shared. This is a trust product.

### Prerequisites before B2B
1. Accounts and a backend (sign in, cohorts, data stored securely).
2. Privacy policy, terms, data handling that meets GDPR/CCPA (and local rules for any education customer).
3. Evidence that it works: completion rates and testimonials from 20 to 50 real users.
4. One pilot with a friendly organisation, ideally free, to learn what advisers actually want.

## What must be built before taking any money
1. **Accounts** so purchases follow the person across devices.
2. **A payment provider** (Stripe or Lemon Squeezy). Never handle card details ourselves.
3. **Server-side verification of purchases.** Right now unlocks are stored in the browser, which is fine for a preview but can be bypassed. Before charging, entitlements must live on a server.
4. **Refund policy, terms, and privacy policy.**
5. Flip `STORE.live` to `true` in `store.js` only after the above.

## Developer mode
Opening the site with `?dev=1` lets you unlock Shop items locally for testing. This is only for testing. It does not charge anyone and gives no real protection.

## Honesty and safety rules for monetisation
- Never imply Void treats depression or anxiety. Keep the helpline link visible.
- Never gate or hide the helpline, or the basic ability to log quests.
- No dark patterns: no fake scarcity, no streak-loss guilt to push purchases, no pressure on people who feel low.
- The Direction Report must stay framed as a pattern in the user's own answers, not career advice.

## Metrics to watch (once there are users)
- Day 1, day 7, day 30 return rate.
- Quests completed per user in the first 14 days.
- Share of users who reach the Direction Report threshold (5 quests).
- Conversion of report viewers to buyers.
- For B2B: pilot completion rate and whether advisers would pay again.

## Next content and product ideas that support revenue
- More quest packs, each aimed at a real path (health care, tech, military, outdoors, sales).
- Re-test quests: "do this again in 3 months" to show change over time.
- A quarterly "Direction Review" that compares your map then and now.
- Weekly reminders (email or push) to bring people back.
