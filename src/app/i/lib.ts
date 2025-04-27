const get_icon_url_character = (icon: string) => {
    return `https://homdgcat.wiki/images/${icon.toLowerCase()}.png`;
  };

  const get_icon_url_element = (element: string) => {
    return `https://homdgcat.wiki/images/Element/${element}.png`;
  };

  const get_icon_url_path = (path: string) => {
    return `https://homdgcat.wiki/images/Paths/${path}.png`;
  };

const get_icon_url_weapon = (id: string) => {
    return `https://homdgcat.wiki/images/lightconemediumicon/${id}.png`;
  
}

const get_icon_url_relic = (icon: string) => {
    return `https://homdgcat.wiki/images/itemfigures/${icon}`;
  };

  const string_with_char_limit = (str: string, limit: number) => {
    if (str.length > limit) {
      return str.substring(0, limit - 3) + "...";
    }
    return str;
  };

  
  const elementColor: { [key: string]: string } = {
    Quantum: "#1C29BA",
    Imaginary: "#F4D258",
    Ice: "#47C7FD",
    Wind: "#00FF9C",
    Fire: "#F84F36",
    Lightning: "#8872F1",
    Physical: "#FFFFFF",
  };

  const elementConvert: { [key: string]: string } = {
    Phys: "Physical",
    Quantum: "Quantum",
    Wind: "Wind",
    Imaginary: "Imaginary",
    Ice: "Ice",
    Elec: "Lightning",
    Fire: "Fire",
  };

  const elementConvertReverse: { [key: string]: string } = {
    Physical: "Phys",
    Quantum: "Quantum",
    Wind: "Wind",
    Imaginary: "Imaginary",
    Ice: "Ice",
    Lightning: "Elec",
    Fire: "Fire",
  };

// const paths = {
//     "Destruction": "Destruction",
//     "Preservation": "Preservation",
//     "Harmony": "Harmony",
//     "Nihility": "Nihility",
//     "Abundance": "Abundance",
//     "Erudition": "Erudition",
//     "Hunt": "Hunt",
//     "Remembrance": "Remembrance",
// }


const paths = ["Destruction", "Preservation", "Harmony", "Nihility", "Abundance", "Erudition", "Hunt", "Remembrance"];
const elements = ["Physical", "Quantum", "Wind", "Imaginary", "Ice", "Lightning", "Fire"];

const transformDesc = (desc: string, level: number, params: any) => {
  // console.log(desc, level, params);
  const descsplitparams_percent = desc.split("[p]");

  for (let i = 0; i < descsplitparams_percent.length; i++) {
    const num = parseInt(descsplitparams_percent[i].split("#")[descsplitparams_percent[i].split("#").length - 1]);
    if (num) {
      descsplitparams_percent[i] = descsplitparams_percent[i].replace("#" + num, params[level - 1][num - 1] * 100 + "%");
    }
  }
  desc = descsplitparams_percent.join("");

  const descsplitparams_float = desc.split("[f]");
  for (let i = 0; i < descsplitparams_float.length; i++) {
    const num = parseInt(descsplitparams_float[i].split("#")[descsplitparams_float[i].split("#").length - 1]);
    if (num) {
      descsplitparams_float[i] = descsplitparams_float[i].replace("#" + num, params[level - 1][num - 1] + "");
    }
  }
  desc = descsplitparams_float.join("");

  return desc;
}


export { get_icon_url_character, get_icon_url_element, get_icon_url_path, string_with_char_limit, elementColor, elementConvert, paths, elementConvertReverse, elements, get_icon_url_weapon, get_icon_url_relic, transformDesc };