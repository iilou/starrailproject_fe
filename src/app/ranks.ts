// import ranks from "./ranks.json";

const ranks: {
  [key: string]: { name: string; color: string; percentile: number };
} = {
  "0": {
    name: "Z",
    color: "#e9e9e9",
    percentile: 99,
  },
  "1": {
    name: "SS",
    color: "#D43636",
    percentile: 97,
  },
  "2": {
    name: "S",
    color: "#FF5151",
    percentile: 92,
  },
  "3": {
    name: "A",
    color: "#6BD36F",
    percentile: 85,
  },
  "4": {
    name: "B",
    color: "#38B3DA",
    percentile: 70,
  },
  "5": {
    name: "C",
    color: "#B2C75F",
    percentile: 60,
  },
  "6": {
    name: "D",
    color: "#C58142",
    percentile: 50,
  },
  "7": {
    name: "F",
    color: "#A92626",
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
