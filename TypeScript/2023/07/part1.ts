import { readFileSync } from "fs";
import { join } from "path";

enum Types {
  FiveOfaKind = "Five of a kind",
  FourOfaKind = "Four of a kind",
  FullHouse = "Full house",
  ThreeOfaKind = "Three of a kind",
  TwoPair = "Two pair",
  OnePair = "One pair",
  HighCard = "High card",
}
const typeRanking = [
  Types.FiveOfaKind,
  Types.FourOfaKind,
  Types.FullHouse,
  Types.ThreeOfaKind,
  Types.TwoPair,
  Types.OnePair,
  Types.HighCard,
];
const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const getTypeOfHand = (hand: string) => {
  const cardCount = hand
    .split("")
    .reduce<{ [key: string]: number }>(
      (p, c) => ({ ...p, [c]: (p[c] ?? 0) + 1 }),
      {}
    );
  const counts = Object.values(cardCount);

  if (counts.includes(5)) return Types.FiveOfaKind;
  if (counts.includes(4)) return Types.FourOfaKind;
  if (counts.includes(3) && counts.includes(2)) return Types.FullHouse;
  if (counts.includes(3)) return Types.ThreeOfaKind;
  if (counts.filter((x) => x === 2).length === 2) return Types.TwoPair;
  if (counts.includes(2)) return Types.OnePair;
  return Types.HighCard;
};

const compareTwoHands = (handA: string, handB: string) => {
  const [typeA, typeB] = [getTypeOfHand(handA), getTypeOfHand(handB)];
  if (typeA !== typeB)
    return typeRanking.indexOf(typeB) - typeRanking.indexOf(typeA);

  const cardsA = handA.split("");
  const cardsB = handB.split("");

  let i = 0;
  while (i < handA.length) {
    if (cardsA[i] != cardsB[i])
      return cards.indexOf(cardsB[i]) - cards.indexOf(cardsA[i]);
    i++;
  }
  return 0;
};

const main = () => {
  const path = join(__dirname, "input.txt");
  const file = readFileSync(path);
  const lines = file.toString().split("\n");

  const result = lines
    .filter((x) => x && x != "")
    .map((x) => {
      const [hand, bid] = x.split(" ");
      return { hand, bid: Number(bid) };
    })
    .sort((a, b) => compareTwoHands(a.hand, b.hand))
    .reduce((p, c, i) => p + (i + 1) * c.bid, 0);

  console.log(result);
};

main();
