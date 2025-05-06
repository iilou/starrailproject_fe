import { elements, paths, elementConvertReverse } from "./lib";

const avatarFilter = (highestMajorVersion: number) => {
    return [
        { name: "Element", displayValues: ["All", ...elements], values: ["All", ...elements.map((e) => elementConvertReverse[e])] },
        { name: "Path", values: ["All", ...paths] },
        { name: "Rarity", displayValues: ["All", "4★", "5★"], values: ["All", "4", "5"] },
        { name: "MajorVersion", values: ["All", ...Array.from({ length: highestMajorVersion }, (_, i) => (i + 1).toString() + ".0")], displayValues:["All", ...Array.from({ length: highestMajorVersion }, (_, i) => "v"+(i + 1).toString() + ".0 +")] },
    ]
}

const avatarSort = [
    { name: "DisplayName", default: "asc" as "asc" | "desc", displayName: "Name" },
    { name: "Rarity", default: "desc" as "asc" | "desc", displayName: "Rarity" },
    { name: "Ver", default: "desc" as "asc" | "desc", displayName: "Version" },
    { name: "Element", default: "asc" as "asc" | "desc", displayName: "Element" },
    { name: "Path", default: "asc" as "asc" | "desc", displayName: "Path" },
    { name: "_id", default: "desc" as "asc" | "desc", displayName: "ID" },
    { name: "stat_atk", default: "desc" as "asc" | "desc", displayName: "ATK" },
    { name: "stat_def", default: "desc" as "asc" | "desc", displayName: "DEF" },
    { name: "stat_hp", default: "desc" as "asc" | "desc", displayName: "HP" },
    { name: "stat_spd", default: "desc" as "asc" | "desc", displayName: "SPD" },
    { name: "stat_aggro", default: "desc" as "asc" | "desc", displayName: "AGGRO" },
]

const weaponFilter = [
    { name: "Path", values: ["All", ...paths] },
    { name: "Rarity", displayValues: ["All", "4★", "5★"], values: ["All", "4", "5"] },
]

const weaponSort = [
    { name: "DisplayName", default: "asc" as "asc" | "desc", displayName: "Name" },
    { name: "Rarity", default: "desc" as "asc" | "desc", displayName: "Rarity" },
    { name: "Path", default: "asc" as "asc" | "desc", displayName: "Path" },
    { name: "_id", default: "desc" as "asc" | "desc", displayName: "ID" },
]

const relicFilter = [
    { name: "Type", values: ["Planar", "Relic"]},
]

const relicSort = [
    { name: "DisplayName", default: "asc" as "asc" | "desc", displayName: "Name" },
    { name: "Type", default: "asc" as "asc" | "desc", displayName: "Type" },
    { name: "_id", default: "desc" as "asc" | "desc", displayName: "ID" },
]

export { avatarFilter, avatarSort, weaponFilter, weaponSort, relicFilter, relicSort };