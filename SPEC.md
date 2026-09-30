# Void — product spec (v0.3)

**Promise:** You can't think your way to your purpose. You test your way there. Void gives you real-world quests, logs how each one makes you feel, and shows you the pattern.

**Target user:** a 20-year-old man who doesn't know what he wants to do with his life and is actively searching for a direction. He should take it seriously. Tone: direct, respectful, never cutesy. 18+ only (age check at setup).

## The loop
1. **Take a quest** — a real-world task with a "why this quest" explanation.
2. **Do it**, then **debrief**: energy before/after, "did you lose track of time?", "do you want more of this?", and a short note.
3. **Get rewarded:** XP, possible rank-up, and a gear drop for your Void.
4. **Read your map:** which fields give you energy, pull, and flow.

## Campaign
- **Phase 1: The Sweep.** Test all six fields once: Create, Body, Mind, People, Explore, Serve.
- **Phase 2: Go Deeper.** Quests lean (about 65%) toward the two fields with the strongest signal.

## Quests
Three tiers: **Recon** (~30 min, 50 XP, common drop), **Mission** (1-2 hrs, 100 XP, rare drop), **Trial** (bigger or uncomfortable, 200 XP, epic drop). Missions unlock after 2 quests. Trials unlock at rank Seeker. +25 XP bonus for writing a debrief note. Quests live in `quests.js` and are editable without code.

## Ranks (XP)
Drifter 0 · Wanderer 150 · Seeker 400 · Explorer 800 · Pathfinder 1,400 · Trailblazer 2,200 · Vanguard 3,200. Void's eyes open up as you rank up.

## Your Void
- At setup: choose a design (Orb, Monolith, Crystal, Wisp) by swiping or with arrows, choose an accent colour, and name it.
- It fills with layers of colour, one per quest, in the colour of the field. The colours blend into a personal gradient.
- **Gear:** 8 items (headband, cap, headphones, glasses, visor, scar, scarf, medal) x 3 rarities (common, rare, epic) = 24 items. Each quest drops one. Equip in the Locker (slots: head, eyes, body).

## Signal scoring (per field)
`avg(energy after - energy before) + (pull yes - pull no) / n + flow moments / n`

## Safety
Quests must be safe, legal and free or cheap. Support link always visible. We never claim to treat depression or anxiety.

## Later
Accounts and sync across devices, more quests (target 100+), reminders, friends and small groups, weekly review, more designs and gear, sound.
