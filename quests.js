// THE QUESTS — the heart of Void. You can edit these without knowing how to code.
// Each quest is a real-world test: do it, then log how it felt. The pattern is what reveals your direction.
//
//   cat:  make | move | learn | social | nature | give
//   tier: recon (about 30 min, easy)  |  mission (1-2 hours)  |  trial (bigger, or uncomfortable)
//   why:  what this quest is designed to reveal about you
const QUESTS = [
  // ---- CREATE ----
  { id: 1,  cat: "make", tier: "recon",   time: "30 min",  title: "Make something ugly on purpose",
    desc: "Set a 30-minute timer. Draw, write, code, build or record anything. It has to be finished, not good.",
    why: "Separates enjoying the act of making from wanting to be good at it." },
  { id: 2,  cat: "make", tier: "recon",   time: "30 min",  title: "Write your own manual",
    desc: "Write 500 words on something you know better than most people: a game, a sport, a job, a way of fixing things. Write it like you're teaching a beginner.",
    why: "What you can explain without effort shows what you already care about." },
  { id: 3,  cat: "make", tier: "recon",   time: "30 min",  title: "Copy a master",
    desc: "Pick a piece of work you admire: a drawing, a song, a design, a paragraph. Spend 30 minutes recreating it as closely as you can.",
    why: "Copying shows the gap between what you see and what you can do, and whether closing that gap excites you." },
  { id: 4,  cat: "make", tier: "mission", time: "90 min",  title: "Follow a beginner tutorial start to finish",
    desc: "Pick a craft you've never tried: woodwork, music production, web design, cooking, photography, leatherwork. Find one beginner tutorial and finish it.",
    why: "A finished tutorial tells you if the craft itself pulls you, not just the idea of it." },
  { id: 5,  cat: "make", tier: "mission", time: "1-2 hours", title: "Fix something that's broken",
    desc: "A bike, a zip, a loose shelf, a laptop key, a bug in a free tool. Work out how, and fix it yourself.",
    why: "Some people come alive solving concrete problems. Find out if you do." },
  { id: 6,  cat: "make", tier: "mission", time: "1-2 hours", title: "Make something for one specific person",
    desc: "Build, cook, write or design something for a real person and hand it to them. No explaining it away.",
    why: "Shows whether you care more about the craft or about what it does for someone." },
  { id: 7,  cat: "make", tier: "trial",   time: "3-4 hours", title: "Ship a tiny project",
    desc: "Finish a small project in one sitting: a one-page site, a short film, a three-track demo, a piece of furniture from scrap wood. Then show it to one person and ask for honest feedback.",
    why: "Starting is easy. Finishing and showing are where most people stop. Notice which part you avoided." },

  // ---- BODY ----
  { id: 8,  cat: "move", tier: "recon",   time: "20 min",  title: "Push yourself for 10 hard minutes",
    desc: "Sprints, hill repeats, burpees, heavy carries, whatever suits you. Ten minutes at an effort you'd rate 8 out of 10. Stop if anything hurts wrong.",
    why: "How you handle discomfort shows what you're willing to work through." },
  { id: 9,  cat: "move", tier: "recon",   time: "30 min",  title: "Be a beginner at something physical",
    desc: "Follow a beginner video for something you've never tried: boxing, climbing technique, kettlebells, yoga, skateboarding basics.",
    why: "Being bad at something new reveals whether you enjoy the learning curve." },
  { id: 10, cat: "move", tier: "mission", time: "90 min",  title: "Ninety minutes of deliberate practice",
    desc: "Choose a skill: shooting hoops, swimming laps, bag work, bouldering, skating. Work on one weakness for 90 minutes and track what improved.",
    why: "Skill practice shows whether mastery pulls you harder than fitness alone." },
  { id: 11, cat: "move", tier: "mission", time: "45 min",  title: "Design and run your own training session",
    desc: "Write a 45-minute session with a clear goal, then run it. Adjust as you go and note what you'd change.",
    why: "Designing your own plan shows whether you like building systems or just following them." },
  { id: 12, cat: "move", tier: "mission", time: "1 hour",  title: "Train with someone better than you",
    desc: "Ask a friend or a gym regular who's better than you to train with you for an hour. Ask them one thing they wish they'd known at your level.",
    why: "Learning next to someone ahead of you shows whether their standard motivates you or intimidates you." },
  { id: 13, cat: "move", tier: "trial",   time: "Half a day", title: "Commit to a physical thing with a date",
    desc: "Register for a local run, a rec-league game, a trial class at a gym, or a martial arts intro session. Then go.",
    why: "Real commitments expose what you follow through on and what you talk yourself out of." },

  // ---- MIND ----
  { id: 14, cat: "learn", tier: "recon",   time: "30 min",  title: "List five times you lost track of time",
    desc: "Write down the last five moments you were so absorbed you forgot what time it was. Not what was productive. What actually absorbed you.",
    why: "Your past flow moments are the best clues you have. Look for the pattern." },
  { id: 15, cat: "learn", tier: "recon",   time: "20 min",  title: "Write the no-limits letter",
    desc: "Twenty minutes, no editing. Write a letter to yourself about what you would do with your life if money, opinions and fear of failing didn't exist.",
    why: "Removing the constraints shows what you actually want, not what you think you should want." },
  { id: 16, cat: "learn", tier: "mission", time: "90 min",  title: "Watch a real intro lecture in a field you know nothing about",
    desc: "Pick one: economics, psychology, medicine, architecture, law, astronomy, philosophy. Find a full university intro lecture and watch it with notes.",
    why: "Curiosity is the earliest sign of a path. Notice what you wanted to look up afterwards." },
  { id: 17, cat: "learn", tier: "mission", time: "1 hour",  title: "Study a career, not a success story",
    desc: "Pick someone whose work you respect. Read a long interview. Write down what they actually did each day when they started out.",
    why: "The daily reality matters more than the title. Would you want that Tuesday?" },
  { id: 18, cat: "learn", tier: "mission", time: "2 hours", title: "Do two hours of a beginner course",
    desc: "Khan Academy, freeCodeCamp, a language course, finance basics, design fundamentals. Two hours, with real notes.",
    why: "Two hours is long enough to know whether a subject pulls you or just sounds impressive." },
  { id: 19, cat: "learn", tier: "trial",   time: "1-2 hours", title: "Answer a hard question in writing",
    desc: "Pick one: What would I regret not trying? What do I keep avoiding? What do I do that other people find hard? Write 1,000 words.",
    why: "Long writing pushes past the easy answers to the real ones." },

  // ---- PEOPLE ----
  { id: 20, cat: "social", tier: "recon",   time: "15 min",  title: "Message someone whose work you admire",
    desc: "Send a short, specific note to someone doing work you respect. Say what you liked and ask one question. Don't ask for anything.",
    why: "Who you feel drawn to reach out to shows what you admire and might want to become." },
  { id: 21, cat: "social", tier: "recon",   time: "20 min",  title: "Ask three people what you're naturally good at",
    desc: "Text three people who know you well: \"What do you think I'm naturally good at?\" Ask for specific examples.",
    why: "Other people often see patterns in you that you can't." },
  { id: 22, cat: "social", tier: "mission", time: "45 min",  title: "Ask someone what their job is actually like",
    desc: "Find someone in a job you're curious about and ask: what does a normal Tuesday look like? What's the worst part? What surprised you?",
    why: "The daily reality of a job is what you'd be signing up for, not the title." },
  { id: 23, cat: "social", tier: "mission", time: "1 hour",  title: "Talk properly with someone twenty years older",
    desc: "A relative, a neighbour, a boss, a coach. Ask what they'd do differently at your age, and what they're glad they did.",
    why: "Looking back from further down the road makes your own options clearer." },
  { id: 24, cat: "social", tier: "trial",   time: "Half a day", title: "Ask a professional for a 20-minute call",
    desc: "Find someone in a field you're curious about: a friend of a friend, a local business owner, someone on LinkedIn. Ask for 20 minutes and prepare three questions.",
    why: "Asking for help is a skill and a signal. If you'd rather avoid this one, note that too." },
  { id: 25, cat: "social", tier: "trial",   time: "2-3 hours", title: "Go to something alone",
    desc: "A meetup, a talk, a workshop, a local league. Somewhere you know nobody. Stay at least an hour and talk to two people.",
    why: "Shows what kind of room you want to be in, and how you handle being the new one." },

  // ---- EXPLORE ----
  { id: 26, cat: "nature", tier: "recon",   time: "30 min",  title: "Go outside with no phone for 30 minutes",
    desc: "Leave it at home. Walk with no destination. Notice what you think about when nothing is competing for your attention.",
    why: "Silence brings up the things you've been avoiding thinking about." },
  { id: 27, cat: "nature", tier: "recon",   time: "30 min",  title: "Identify five things around you",
    desc: "Trees, birds, constellations, car engines, whatever is nearby. Look up the names of five things you've never bothered to learn.",
    why: "What you want to name shows what holds your attention." },
  { id: 28, cat: "nature", tier: "mission", time: "2 hours", title: "Take a long solo walk with no headphones",
    desc: "Two hours minimum, somewhere you've never been if you can. Bring water and tell someone where you're going.",
    why: "Long stretches alone with your thoughts surface the questions you're avoiding." },
  { id: 29, cat: "nature", tier: "mission", time: "1-2 hours", title: "Visit a place where people work",
    desc: "A workshop open day, a farm, a studio, a market, a fire station or factory tour. Watch people doing their jobs.",
    why: "You can only imagine a path if you've seen people on it." },
  { id: 30, cat: "nature", tier: "mission", time: "1-2 hours", title: "Navigate a route with only a map",
    desc: "Plan a route on a paper or offline map, then follow it on a walk without turn-by-turn GPS.",
    why: "Shows whether you enjoy figuring things out for yourself." },
  { id: 31, cat: "nature", tier: "trial",   time: "A full day", title: "Spend a whole day somewhere new",
    desc: "Take a train, bus or drive somewhere you've never been and be back by night. No plan except to look around and talk to one person.",
    why: "Unfamiliar places stretch your idea of what a life could look like." },

  // ---- SERVE ----
  { id: 32, cat: "give", tier: "recon",   time: "20 min",  title: "Do something useful for someone, unasked and unseen",
    desc: "Fix, carry, clean, pay for or organise something for someone. Don't tell them it was you.",
    why: "Notice whether doing good is enough without the credit." },
  { id: 33, cat: "give", tier: "recon",   time: "30 min",  title: "Thank someone who shaped you",
    desc: "A teacher, coach, relative or friend. Be specific about what they did and what it changed for you. Send it.",
    why: "Who you thank shows what you value." },
  { id: 34, cat: "give", tier: "mission", time: "45 min",  title: "Teach someone a skill you have",
    desc: "Anything real: a lift, a recipe, a game, a shortcut, a trade skill. Teach for at least 45 minutes.",
    why: "Teaching shows whether you get energy from passing things on." },
  { id: 35, cat: "give", tier: "mission", time: "1 hour",  title: "Help someone with a real problem",
    desc: "Ask someone close to you what they're stuck on. Spend an hour helping them make progress on it.",
    why: "Solving other people's problems shows what kind of problems you're drawn to." },
  { id: 36, cat: "give", tier: "mission", time: "One shift", title: "Volunteer for one shift",
    desc: "Food bank, animal shelter, community clean-up, youth sports. Sign up and show up for a full shift.",
    why: "Some people find their direction in serving. See whether you feel it." },
  { id: 37, cat: "give", tier: "trial",   time: "1-2 hours", title: "Mentor or coach someone for an hour",
    desc: "Offer to help someone younger with homework, a sport, a job application or a skill. Show up prepared.",
    why: "Responsibility for another person's progress shows what kind of leader you'd be." }
];

const TIERS = {
  recon:   { label: "Recon",   xp: 50,  gear: "common" },
  mission: { label: "Mission", xp: 100, gear: "rare" },
  trial:   { label: "Trial",   xp: 200, gear: "epic" }
};

// The six fields you sweep in Phase 1. "ask" is the reflection prompt shown after a quest in that field.
const CATEGORIES = {
  make:   { label: "Create",  color: "#c58a9f", ask: "Which part did you like most: starting, making, or finishing?" },
  move:   { label: "Body",    color: "#c9965c", ask: "How did you feel when it got hard?" },
  learn:  { label: "Mind",    color: "#6f97b8", ask: "What did you want to look up next?" },
  social: { label: "People",  color: "#c47f6c", ask: "What did you learn about what they actually do or feel?" },
  nature: { label: "Explore", color: "#6f9f86", ask: "What did you think about when it went quiet?" },
  give:   { label: "Serve",   color: "#c4ad72", ask: "What did it feel like to do it?" }
};
