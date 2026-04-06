const tarotCards = {
  mysterious: [
    '/tarot/mysterious/the-veil.png',
    '/tarot/mysterious/the-cipher.png',
    '/tarot/mysterious/the-threshold.png',
    '/tarot/mysterious/the-chasm.png',
    '/tarot/mysterious/the-oracle.png',
    '/tarot/mysterious/the-omen.png',
  ],
  peaceful: [
    '/tarot/peaceful/the-lotus.png',
    '/tarot/peaceful/the-garden.png',
    '/tarot/peaceful/the-tide.png',
    '/tarot/peaceful/temperance.png',
    '/tarot/peaceful/the-signal.png',
    '/tarot/peaceful/the-still.png',
  ],
  dark: [
    '/tarot/dark/the-abyss.png',
    '/tarot/dark/the-eclipse.png',
    '/tarot/dark/the-raven.png',
    '/tarot/dark/the-beast.png',
    '/tarot/dark/the-sacrifice.png',
    '/tarot/dark/death-1.png',
  ],
  adventurous: [
    '/tarot/adventurous/the-wanderer.png',
    '/tarot/adventurous/the-storm-rider.png',
    '/tarot/adventurous/the-horizon.png',
    '/tarot/adventurous/the-summit.png',
    '/tarot/adventurous/the-leap.png',
    '/tarot/adventurous/the-compass.png',
  ],
  confusing: [
    '/tarot/confusing/the-paradox.png',
    '/tarot/confusing/the-mirage.png',
    '/tarot/confusing/the-tangle.png',
    '/tarot/confusing/the-loop.png',
    '/tarot/confusing/the-echo.png',
    '/tarot/confusing/the-unmask.png',
  ],
};

export function getRandomTarotCard(mood: string | null): string {
  const cards = tarotCards[mood as keyof typeof tarotCards] 
    || tarotCards.mysterious;
  return cards[Math.floor(Math.random() * cards.length)];
}
