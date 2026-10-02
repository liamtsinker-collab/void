// How Void talks. Three personalities, each with its own lines for every moment.
// Placeholders: {name} = your name, {void} = Void's name, plus {quest} {field} {n} {a} {b} {streak} {prev} {best} {rank} {career}.
// You can edit any line here without knowing how to code. Add more lines to a list and Void picks one at random.
const VOICES = {
  calm:  { label: "Calm",       blurb: "Steady and supportive. Never pushes.",                       sample: "Take your time, {name}. I'll be right here." },
  dry:   { label: "Dry",        blurb: "Dry humour. Honest, a little sarcastic, always on your side.", sample: "Look at you, {name}, doing things. Unprecedented." },
  tough: { label: "Tough love", blurb: "Direct. Pushes you, because it knows you can.",              sample: "Let's go, {name}. No more waiting." }
};

const LINES = {
  // ----- time of day (first open of the day) -----
  greetMorning: {
    calm:  ["Good morning, {name}. Ready when you are.", "Morning, {name}. A small step today is plenty."],
    dry:   ["Morning, {name}. You showed up. I'm choosing to be impressed.", "Good morning. I've been empty all night. Thrilling."],
    tough: ["Morning, {name}. Let's make today count.", "Up and at it, {name}. What are we testing today?"]
  },
  greetAfternoon: {
    calm:  ["Good afternoon, {name}. How's the day going?", "Hey {name}. Good to see you."],
    dry:   ["Afternoon, {name}. Still no purpose. You?", "Oh, hello {name}. Done being productive elsewhere?"],
    tough: ["Afternoon, {name}. Plenty of day left. Use it.", "{name}. Good. Let's get a quest done."]
  },
  greetEvening: {
    calm:  ["Evening, {name}. There's still time for something small.", "Hi {name}. How was your day?"],
    dry:   ["Evening, {name}. Saving the best for last, I assume.", "Ah, {name}. The evening shift."],
    tough: ["Evening, {name}. Day's not over. One quest.", "{name}. Don't let today end without testing something."]
  },
  greetNight: {
    calm:  ["It's late, {name}. A small quest, then rest.", "Hey {name}. Don't stay up too late for me."],
    dry:   ["It's late, {name}. Even I'm tired, and I'm literally empty.", "Midnight energy, {name}. Respect."],
    tough: ["It's late, {name}. One quick one, then sleep. No excuses.", "{name}. Quest, then bed. Discipline works both ways."]
  },

  // ----- home -----
  first: {
    calm:  ["Hi {name}. I'm {void}. I don't know what I'm for yet either. Let's find out together."],
    dry:   ["{name}. I'm {void}. I'm empty and directionless, so we have a lot in common. Let's fix that."],
    tough: ["{name}, I'm {void}. Neither of us knows what we're for yet. We find out by doing. Let's go."]
  },
  questActive: {
    calm:  ["Take your time, {name}. Come back when it's done."],
    dry:   ["Off you go, {name}. I'll be here, being a vessel."],
    tough: ["Go, {name}. The quest won't do itself. Come back when it's done."]
  },
  homeSweep: {
    calm:  ["Good. Every field you test makes the picture clearer, {name}.", "Keep sweeping, {name}. We're learning what pulls you."],
    dry:   ["Another data point, {name}. We're basically scientists.", "More testing. I love a methodical person."],
    tough: ["Keep sweeping, {name}. Test every field. No skipping the ones you're scared of."]
  },
  homeDeep: {
    calm:  ["A pattern is forming, {name}. Let's keep testing it."],
    dry:   ["Patterns, {name}. Suspicious, in a good way."],
    tough: ["You've got signals, {name}. Now dig into them."]
  },
  homeLate: {
    calm:  ["Look at the record, {name}. You've been paying attention. That counts."],
    dry:   ["{n} quests, {name}. I'd say I'm proud, but I'm mostly hollow. Still: proud."],
    tough: ["{n} quests in. You're not guessing anymore, {name}. Keep it up."]
  },
  poke: {
    calm:  ["I'm here, {name}.", "No rush.", "Small steps still count.", "Glad you're here."],
    dry:   ["Poke me again, see what happens.", "That tickles. Allegedly.", "Yes, {name}? I'm a blob. I have no urgent business.", "I'm fine. Thanks for asking."],
    tough: ["Stop poking, start doing.", "Quest. Now.", "You didn't open me for this, {name}.", "Next move is yours."]
  },
  scan: {
    calm:  ["Looking for a good one for you…"],
    dry:   ["Consulting the void. It's mostly empty. Hang on…"],
    tough: ["Finding you a challenge…"]
  },
  accept: {
    calm:  ["Good choice, {name}. I'm with you."],
    dry:   ["Brave. Or foolish. We'll find out."],
    tough: ["That's the spirit. Go get it, {name}."]
  },
  welcomeBack: {
    calm:  ["Welcome back, {name}. No pressure. Let's pick up where we left off."],
    dry:   ["Oh, you remember me. Welcome back, {name}."],
    tough: ["Good to see you, {name}. Now let's get back to work."]
  },

  // ----- finishing quests -----
  completeRecon: {
    calm:  ["Nice, {name}. Small steps are how this works."],
    dry:   ["A recon, done. Tiny, but real, {name}."],
    tough: ["Recon done. Now step it up."]
  },
  completeMission: {
    calm:  ["That took effort, {name}. I felt it."],
    dry:   ["A whole mission. {name}, you're getting dangerous."],
    tough: ["Mission complete. That's what I'm talking about, {name}."]
  },
  completeTrial: {
    calm:  ["That was hard, and you did it anyway. I'm proud of you, {name}."],
    dry:   ["A trial. Look at you, {name}. Fearless. Or confused. Either works."],
    tough: ["A trial, {name}. That's real. Don't downplay it."]
  },
  rankUp: {
    calm:  ["You've reached {rank}, {name}. I can feel the change in me."],
    dry:   ["{rank}. Fancy. I'm evolving, apparently."],
    tough: ["{rank}, {name}. Earned, not given. Keep pushing."]
  },

  // ----- streaks -----
  streakDay: {
    calm:  ["Day {streak}, {name}. Good to see you again."],
    dry:   ["Day {streak}. Look who keeps showing up."],
    tough: ["Day {streak}. Keep it alive, {name}."]
  },
  streakThree: {
    calm:  ["Three days in a row. Something is igniting, {name}."],
    dry:   ["Three days. I'm on fire. Literally. Check my head."],
    tough: ["Three days. Don't you dare stop now, {name}."]
  },
  streakShield: {
    calm:  ["You missed a day, but a shield covered it. Streak: {streak}."],
    dry:   ["You vanished for a day and a shield saved you. Streak: {streak}. Don't make it a habit."],
    tough: ["A shield saved you yesterday, {name}. Use today well. Streak: {streak}."]
  },
  streakBroken: {
    calm:  ["Your {prev}-day streak ended. That's okay, {name}. We start again today. Best so far: {best}."],
    dry:   ["The streak ended at {prev} days. Tragic. Anyway, day one again. Best: {best}."],
    tough: ["Streak ended at {prev}. Shake it off, {name}. Day one starts now. Best: {best}."]
  },
  streakMilestone: {
    calm:  ["{streak} days in a row. That's real discipline, {name}."],
    dry:   ["{streak} days. Even I'm impressed, and I'm a void."],
    tough: ["{streak} days. That's what consistency looks like, {name}."]
  },

  // ----- memory: Void remembers what you've actually done -----
  memFlowRecent: {
    calm:  ["Remember \"{quest}\"? You lost track of time. I haven't forgotten, {name}."],
    dry:   ["\"{quest}\" made you lose track of time. Just saying, {name}. It's noted."],
    tough: ["\"{quest}\" got you into flow, {name}. Pay attention to that."]
  },
  memFlowRepeat: {
    calm:  ["That's {n} {field} quests where you lost track of time, {name}. That means something."],
    dry:   ["{n} {field} quests, and you lost track of time in each. Not an accident, {name}."],
    tough: ["{n} flow moments in {field}. That's a pattern, {name}. Chase it."]
  },
  memFlowFirst: {
    calm:  ["You lost track of time on that one, {name}. Remember that feeling."],
    dry:   ["Lost track of time, did we? Interesting. File that away, {name}."],
    tough: ["Flow, {name}. That's rare. Note what caused it."]
  },
  memStrong: {
    calm:  ["Your strongest signal right now is {field}, {name}."],
    dry:   ["{field} keeps coming up. I'm not saying it's your thing, but it's heavily implied."],
    tough: ["{field}. That's where you light up, {name}. Lean in."]
  },
  memDrain: {
    calm:  ["{field} keeps leaving you drained. That's useful to know, {name}. We won't force it."],
    dry:   ["{field} drains you. Noted. Nobody's making you love it."],
    tough: ["{field} drains you. Fine. Know that and move on, {name}."]
  },
  memJump: {
    calm:  ["\"{quest}\" took your energy from {b} to {a}. That one mattered."],
    dry:   ["Energy {b} to {a} after \"{quest}\". Whatever that was, do more of it."],
    tough: ["\"{quest}\" took you from {b} to {a} on energy. Chase that."]
  },
  memCareer: {
    calm:  ["{career} keeps showing up in your best quests, {name}."],
    dry:   ["{career} again. Starting to feel like a theme."],
    tough: ["{career} keeps coming up in your best quests. Look into it, {name}."]
  },
  memVolume: {
    calm:  ["{n} quests done, {name}. Most people never test even one."],
    dry:   ["{n} quests. Most people just think about it. You're an overachiever."],
    tough: ["{n} quests. Most people never start. Keep going, {name}."]
  },
  memNoPull: {
    calm:  ["That one wasn't for you. That's useful to know, {name}."],
    dry:   ["Not for you. Excellent. One less thing to wonder about."],
    tough: ["Not for you. Good. Cross it off and move on, {name}."]
  }
};

function fmt(text, vars) {
  return text
    .replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ""))
    .replace(/\s+,/g, ",").replace(/,\s*([.!?])/g, "$1");
}
function voiceLine(event, vars, voice) {
  const pool = LINES[event];
  if (!pool) return "";
  const arr = pool[voice] || pool.calm;
  return fmt(arr[Math.floor(Math.random() * arr.length)], vars || {});
}
