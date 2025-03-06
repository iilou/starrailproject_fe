// import ranks from "./ranks.json";

const ranks: {
  [key: string]: { name: string; color: string; percentile: number };
} = {
  "0": {
    name: "GOD",
    color: "#e9e9e9",
    percentile: 98,
  },
  "1": {
    name: "S",
    color: "#ff0000",
    percentile: 95,
  },
  "2": {
    name: "A",
    color: "#ff8000",
    percentile: 90,
  },
  "3": {
    name: "B",
    color: "#ffff00",
    percentile: 80,
  },
  "4": {
    name: "C",
    color: "#00ff00",
    percentile: 70,
  },
  "5": {
    name: "D",
    color: "#0000ff",
    percentile: 60,
  },
  "6": {
    name: "E",
    color: "#8000ff",
    percentile: 50,
  },
  "7": {
    name: "F",
    color: "#ff00ff",
    percentile: 40,
  },
};

const get_rank_from_score = (score: number, max: number) => {
  for (let i = 0; i < 8; i++) {
    if (score >= ranks[i].percentile * max * 0.01) {
      return ranks[i];
    }
  }
  return ranks[7];
};

export { ranks, get_rank_from_score };
