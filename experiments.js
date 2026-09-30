// THE EXPERIMENTS — this is the heart of Void, and you can edit it without knowing how to code.
// Each one is a small, safe, cheap thing to try. Copy a line, change the words, save.
// cat must be one of: make, move, learn, social, nature, give
const EXPERIMENTS = [
  // MAKE
  { id: 1,  cat: "make",   mins: 20, title: "Draw your left hand",            desc: "Pen and paper. Don't aim for good. Aim for finished." },
  { id: 2,  cat: "make",   mins: 30, title: "Cook something you've never made", desc: "Pick a recipe with 6 ingredients or fewer and just do it." },
  { id: 3,  cat: "make",   mins: 15, title: "Build something from junk",      desc: "Cardboard, tape, whatever's lying around. Make a tiny thing." },
  { id: 4,  cat: "make",   mins: 20, title: "Write a 6-word story",           desc: "Like: 'Bought a ticket. Never came back.' Then write two more." },
  // MOVE
  { id: 5,  cat: "move",   mins: 20, title: "Walk with no destination",       desc: "Turn at whatever looks interesting. No phone maps allowed." },
  { id: 6,  cat: "move",   mins: 10, title: "Dance to one full song",         desc: "Alone, curtains closed, zero rules. Pick a song you loved at 15." },
  { id: 7,  cat: "move",   mins: 30, title: "Follow a beginner yoga video",   desc: "Any free one. Notice how your body feels before and after." },
  { id: 8,  cat: "move",   mins: 45, title: "Try a sport you've never played", desc: "Shoot hoops, kick a ball, hit a shuttlecock. Bad is fine." },
  // LEARN
  { id: 9,  cat: "learn",  mins: 20, title: "Learn 10 words in a new language", desc: "Free app or YouTube. Say them out loud." },
  { id: 10, cat: "learn",  mins: 30, title: "Fall down a rabbit hole",        desc: "Look up something you've always wondered about. Follow the links." },
  { id: 11, cat: "learn",  mins: 25, title: "Learn a magic trick",            desc: "Find an easy card or coin trick and learn it well enough to show someone." },
  { id: 12, cat: "learn",  mins: 30, title: "Watch a documentary on a random job", desc: "Beekeeper? Stonemason? Air traffic controller? Notice if you get curious." },
  // SOCIAL
  { id: 13, cat: "social", mins: 10, title: "Message someone you miss",       desc: "Not 'hey'. Say something specific you remember about them." },
  { id: 14, cat: "social", mins: 15, title: "Ask a stranger a real question", desc: "A barista, a neighbour. 'What's the best part of your day usually?'" },
  { id: 15, cat: "social", mins: 30, title: "Ask someone about their job",    desc: "Ask what they love and hate about it. People love being asked." },
  { id: 16, cat: "social", mins: 60, title: "Say yes to one invite",          desc: "Someone asked you to something recently? Go for just one hour." },
  // NATURE
  { id: 17, cat: "nature", mins: 15, title: "Watch a sunrise or sunset",      desc: "Phone away. Just watch the whole thing." },
  { id: 18, cat: "nature", mins: 20, title: "Find 5 things you've never noticed nearby", desc: "Walk around your block. Look up, look small." },
  { id: 19, cat: "nature", mins: 30, title: "Sit outside and just listen",    desc: "Count how many different sounds you can pick out." },
  { id: 20, cat: "nature", mins: 45, title: "Visit a park you've never been to", desc: "Look it up, go, wander. Bonus: take one photo." },
  // GIVE
  { id: 21, cat: "give",   mins: 10, title: "Do a secret kind thing",         desc: "Pay for someone's coffee, leave a nice note, tidy something up. Tell no one." },
  { id: 22, cat: "give",   mins: 15, title: "Write a thank-you message",      desc: "To someone who helped you once and never got thanked." },
  { id: 23, cat: "give",   mins: 30, title: "Teach someone something you know", desc: "Anything. A recipe, a game, a shortcut. Notice how it feels." },
  { id: 24, cat: "give",   mins: 30, title: "Give away 5 things",             desc: "Find 5 things you don't use and pass them on or donate them." }
];

const CATEGORIES = {
  make:   { label: "Make",   emoji: "🎨", color: "#e39aae" },
  move:   { label: "Move",   emoji: "⚡", color: "#e3a765" },
  learn:  { label: "Learn",  emoji: "🧠", color: "#86aecb" },
  social: { label: "Social", emoji: "💬", color: "#dd9179" },
  nature: { label: "Nature", emoji: "🌿", color: "#86b89a" },
  give:   { label: "Give",   emoji: "💛", color: "#e2cb84" }
};
