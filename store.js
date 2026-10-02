// The Shop's settings. Prices here are PLACEHOLDERS to design around. Change them freely.
const STORE = {
  // Keep false until real payments are connected (e.g. Stripe or Lemon Squeezy) AND purchases are verified on a server.
  // While false, the Shop shows everything but nothing can be bought.
  live: false,
  prices: { report: "$7.99", pack: "$4.99", design: "$2.99", accents: "$0.99" }
};

// Feedback: paste the link to a free form here (Google Forms, Tally, Typeform...).
// While this is empty the feedback buttons stay hidden, so nobody is shown a button that goes nowhere.
const FEEDBACK_URL = "";

// Developer mode: open the site with ?dev=1 to unlock things locally for testing. Never use this to charge anyone.
const DEV = (function () { try { return new URLSearchParams(location.search).has("dev"); } catch (e) { return false; } })();
