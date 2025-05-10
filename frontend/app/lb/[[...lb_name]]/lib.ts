
  const charDbTypes: {
    [key: string]: { name: string; id: number; lb_types: string[] };
  } = {
    Seele: {
      name: "Seele",
      id: 1102,
      lb_types: ["", "", ""],
    },
    "Dan Heng • Imbibitor Lunae": {
      name: "Dan Heng • Imbibitor Lunae",
      id: 1213,
      lb_types: [""],
    },
    "The Herta": {
      name: "The Herta",
      id: 1401,
      lb_types: [""],
    },
    Feixiao: {
      name: "Feixiao",
      id: 1220,
      lb_types: [""],
    },
    Firefly: {
      name: "Firefly",
      id: 1310,
      lb_types: [""],
    },
    Aglaea: {
      name: "Aglaea",
      id: 1402,
      lb_types: [""],
    },
    Castorice: {
      name: "Castorice",
      id: 1407,
      lb_types: [""],
    },
    Acheron: {
      name: "Acheron",
      id: 1308,
      lb_types: [""],
    },
    Gallagher: {
      name: "Gallagher",
      id: 1301,
      lb_types: [""],
    },
    Robin: {
      name: "Robin",
      id: 1309,
      lb_types: [""],
    },
    "Ruan Mei": {
      name: "Ruan Mei",
      id: 1303,
      lb_types: [""],
    },
    Anaxa: {
      name: "Anaxa",
      id: 1405,
      lb_types: [""],
    },
  };

const get_lb_types = (id: number) => {
    const char = Object.values(charDbTypes).find((char) => char.id === id);
    if (char) {
        return char.lb_types;
    }
    return [];
};

export { charDbTypes, get_lb_types };