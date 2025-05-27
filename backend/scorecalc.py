from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg2 import sql
from dotenv import load_dotenv
from pydantic import BaseModel
import copy
from damage_b1 import seele_solo, herta_tribbie_aven


lb_types = {
    "Seele": {
        "types": ["solo"],
        "calculation_function": [seele_solo],
    },
    "Dan Heng \u2022 Imbibitor Lunae": {
        "types": [],
        "calculation_function": [],
    },
    "The Herta": {
        "types": ["tribbie_aven"],
        "calculation_function": [herta_tribbie_aven],
    },
    "Feixiao": {
        "types": [],
        "calculation_function": [],
    },
    "Firefly": {
        "types": [],
        "calculation_function": [],
    },
    "Aglaea": {
        "types": [],
        "calculation_function": [],
    },
    "Castorice": {
        "types": [],
        "calculation_function": [],
    },
    "Acheron": {
        "types": [],
        "calculation_function": [],
    },
    "Gallagher": {
        "types": [],
        "calculation_function": [],
    },
    "Robin": {
        "types": [],
        "calculation_function": [],
    },
    "Ruan Mei": {
        "types": [],
        "calculation_function": [],
    },
    "Anaxa": {
        "types": [],
        "calculation_function": [],
    },
}

dat = """INFO	HPDelta	AttackDelta	DefenceDelta	HPAddedRatio	AttackAddedRatio	DefenceAddedRatio	SpeedDelta	CriticalChanceBase	CriticalDamageBase	StatusProbabilityBase	StatusResistanceBase	BreakDamageAddedRatioBase	HealRatioBase	SPRatioBase	IceAddedRatio	QuantumAddedRatio	ImaginaryAddedRatio	FireAddedRatio	WindAddedRatio	ThunderAddedRatio	PhysicalAddedRatio
Seele	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0.7	0	0	0	0	0
Dan Heng \u2022 Imbibitor Lunae	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0.7	0	0	0	0
The Herta	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0.7	0	0	0	0	0	0
Feixiao	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0.7	0	0
Firefly	0	0.2	0	0	0.7	0	1	0	0	0	0	1	0	0	0	0	0	0	0	0	0
Aglaea	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0.7	0	0
Castorice	0.35	0	0	1	0	0	0	1	1	0	0	0	0	0	0	0.7	0	0	0	0	0
Acheron	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0	0.7	0
Gallagher	0.35	0	0	1	0	0	1	0	0	0	0	1	1	1	0	0	0	0	0	0	0
Robin	0	0.35	0	0	1	0	1	0	0	0	0	0	0	1	0	0	0	0	0	0	0
Ruan Mei	0	0	0	0	0	0	1	0	0	0	0	1	0	1	0	0	0	0	0	0	0
Anaxa	0	0.2	0	0	0.7	0	1	1	1	0	0	0	0	0	0	0	0	0	0.7	0	0"""

weights = """HPDelta	42.337549	38.1037941	33.8700392
AttackDelta	21.168773	19.0518957	16.9350184
DefenceDelta	21.168773	19.0518957	16.9350184
HPAddedRatio	0.04320000065	0.03888000059	0.03456000052
AttackAddedRatio	0.04320000065	0.03888000059	0.03456000052
DefenceAddedRatio	0.05399999977	0.04859999979	0.04319999982
SpeedDelta	2.600000001	2.3	2
CriticalChanceBase	0.03240000084	0.02916000076	0.02592000067
CriticalDamageBase	0.06480000168	0.05832000151	0.05184000134
StatusProbabilityBase	0.04320000065	0.03888000059	0.03456000052
StatusResistanceBase	0.04320000065	0.03888000059	0.03456000052
BreakDamageAddedRatioBase	0.06480000168	0.05832000151	0.05184000134
HealRatioBase	0.0345606	0.03110454	0.02764848
SPRatioBase	0.0194394	0.01749546	0.01555152
IceAddedRatio	0.0388803		
QuantumAddedRatio	0.0388803		
ImaginaryAddedRatio	0.0388803		
FireAddedRatio	0.0388803		
WindAddedRatio	0.0388803		
ThunderAddedRatio	0.0388803		
PhysicalAddedRatio	0.0388803		"""

property_hash = {
    "HPDelta": 0,
    "AttackDelta": 1,
    "DefenceDelta": 2,
    "HPAddedRatio": 3,
    "AttackAddedRatio": 4,
    "DefenceAddedRatio": 5,
    "SpeedDelta": 6,
    "CriticalChanceBase": 7,
    "CriticalDamageBase": 8,
    "StatusProbabilityBase": 9,
    "StatusResistanceBase": 10,
    "BreakDamageAddedRatioBase": 11,
    "HealRatioBase": 12,
    "SPRatioBase": 13,
    "IceAddedRatio": 14,
    "QuantumAddedRatio": 15,
    "ImaginaryAddedRatio": 16,
    "FireAddedRatio": 17,
    "WindAddedRatio": 18,
    "ThunderAddedRatio": 19,
    "PhysicalAddedRatio": 20,
}

set_weights = """INFO	101|2	102|2	103|2	104|2	105|2	106|2	107|2	108|2	109|2	110|2	111|2	112|2	113|2	114|2	115|2	116|2	117|2	118|2	119|2	120|2	121|2	122|2	123|2	124|2	101|4	102|4	103|4	104|4	105|4	106|4	107|4	108|4	109|4	110|4	111|4	112|4	113|4	114|4	115|4	116|4	117|4	118|4	119|4	120|4	121|4	122|4	123|4	124|4	301|2	302|2	303|2	304|2	305|2	306|2	307|2	308|2	309|2	310|2	311|2	312|2	313|2	314|2	315|2	316|2	317|2	318|2	319|2	320|2
Seele	0	1.944444415	0	0	0	0	0	1.800397631	0	0	0	0	0	0.01615384615	0	1.944444415	1.62037037	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	1.800397631	3	1.615384615	0	2.314814815	3.240740741	0	0.9020618557	8.504983391	0	0	0	3.086419753	1.234567901	2.153846154	0	0	1.804123711	0	0	1.851851852	0	5.401192892	0	-0.02153846153	3.888888889	0	0	0	2.469135802	3.822228586	0	0	4.273259514	0	4.650630011	0	2.469135802	1.944444444	0	1.615384615	0	2.469135802	0	1.615384615
Dan Heng \u2022 Imbibitor Lunae	0	1.944444415	0	0	0	0	0	0	0	0	0	1.800397631	0	0.01615384615	0	1.944444415	1.62037037	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	0	3	3.415782246	0	2.314814815	3.240740741	0	0	6.334440753	0	0	0	4.166666667	2.469135802	2.153846154	0	0	1.804123711	0	0	1.851851852	0	0	0	-0.02153846153	3.888888889	0	0	0	2.469135802	2.469135802	0	0	6.077383225	0	1.944444444	0	2.469135802	1.944444444	0	1.615384615	0	2.469135802	0	1.615384615
The Herta	0	1.944444415	0	1.800397631	0	0	0	0	0	0	0	0	0	0.01615384615	0	1.944444415	5.696202532	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	0	3	1.615384615	0	2.314814815	3.240740741	0	1.804123711	9.302325581	0	0	0	6.172839506	2.469135802	2.153846154	0	0	1.804123711	0	0	1.851851852	0	7.201590523	0	6.151300885	3.888888889	0	0	0	2.469135802	2.807408998	0	0	5.175321369	0	1.944444444	0	2.469135802	5.648148148	0	1.615384615	0	2.469135802	0	1.615384615
Feixiao	0	1.944444415	0	0	0	0	0	0	0	1.800397631	0	0	0	0.01615384615	0	1.944444415	1.62037037	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	0	3	1.615384615	0	2.314814815	3.240740741	0	0	6.334440753	0	0	0	3.086419753	2.469135802	2.153846154	0	0	1.804123711	0	0	8.346697213	0	3.600795261	0	6.151300885	3.888888889	0	0	0	2.469135802	5.175321369	0	0	2.469135802	0	1.944444444	0	2.469135802	5.648148148	3.858024691	1.615384615	0	2.469135802	0	1.615384615
Firefly	0	1.944444415	0	0	0	0	0	0	0	0	2.469135738	0	0	0.02307692307	0	1.944444415	0	2.469135738	2.469135738	1.944444415	0.02307692307	0	1.944444415	0	3	2.307692307	0	0	3.240740741	0	0	6.334440753	0	0	2.469135738	0	0	2.307692308	0	0	0	0	11.62790698	0	0	0	0	-0.03076923076	3.888888889	0	0	0	0	0	5.555555556	0	0	0	1.944444444	0	0	1.944444444	0	8.480531814	0	0	0	2.307692307
Aglaea	0	1.944444415	0	0	0	0	0	0	0	1.800397631	0	0	0	0.01615384615	0	1.944444415	1.62037037	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	0	3	1.615384615	0	2.314814815	3.240740741	0	0	0	0	0	0	3.086419753	2.469135802	2.153846154	0	0	1.804123711	0	0	1.851851852	0	0	6.245014245	-0.02153846153	0.6172839506	0	0	0	0	0	0	0	0	0	0	0	0	2.561728395	0	1.615384615	0	2.469135802	0	1.615384615
Castorice	0	0	0	0	0	0	0	1.800397631	0	0	0	0	2.777777736	0	0	0	0	0	0	0	0	2.469135738	0	1.800397631	3	0	0	0	0	0	0	0	0	0	0	0	0	2.153846154	0	0	1.234567869	0	0	0	0	0	0	9.876542954	0	2.777777736	0	0	2.469135738	2.469135738	0	0	2.469135738	0	0	0	1.234567869	0	0	0	0	0	7.098765278	0
Acheron	0	1.944444415	0	0	0	0	0	0	1.800397631	0	0	0	0	0.01615384615	0	1.944444415	0	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	0	3	1.615384615	0	0	0	0	0	6.334440753	0	0	0	0	2.469135802	2.153846154	0	0	1.234567869	0	0	0	0	3.600795261	0	6.151300885	1.944444415	0	0	0	2.469135738	2.469135738	0	0	2.469135738	0	1.944444415	0	1.234567869	1.944444415	0	1.615384615	0	2.469135738	0	1.615384615
Gallagher	2.893468285	0	0	0	0	0	0	0	0	0	2.469135738	0	2.777777736	0.02307692307	0	0	0	2.469135738	2.469135738	0	0.02307692307	0	0	0	3	2.307692307	0	0	0	0	0	0	0	0	2.469135738	0	0	2.153846154	0	0	0	0	0	0	3.846153845	0	0	-0.03076923076	0	2.777777736	0	0	0	0	2.469135738	7.572095847	0	0	0	7.572095847	0	0	0	2.307692308	7.572095847	0	2.777777736	2.307692307
Robin	0	2.777777736	0	0	0	0	0	0	0	0	0	0	0	0.02307692307	0	2.777777736	0	0	0	2.777777736	0.02307692307	0	2.777777736	0	3	2.307692307	0	0	0	0	0	0	0	0	0	0	0	2.153846154	0	0	0	0	0	0	3.846153845	0	0	-0.03076923076	2.777777736	0	0	0	0	0	0	7.572095847	0	0	2.777777736	7.572095847	0	2.777777736	0	2.307692308	7.572095847	0	0	2.307692307
Ruan Mei	0	0	0	0	0	0	0	0	0	0	2.469135738	0	0	0.02307692307	0	0	0	2.469135738	2.469135738	0	0.02307692307	0	0	0	3	2.307692307	0	0	0	0	0	0	0	0	2.469135738	0	0	2.153846154	0	0	0	0	0	0	3.846153845	0	0	-0.03076923076	0	0	0	0	0	0	2.469135738	7.572095847	0	0	0	7.572095847	0	0	0	2.307692308	7.572095847	0	0	2.307692307
Anaxa	0	1.944444415	0	0	0	0	0	0	0	1.800397631	0	0	0	0.02307692307	0	1.944444415	5.696202532	0	0	1.944444415	0.02307692307	2.469135738	1.944444415	0	3	2.307692307	0	2.314814815	3.240740741	0	1.804123711	9.302325581	0	7.692307692	0	6.172839506	2.469135802	2.307692308	0	0	1.234567869	0	0	1.851851852	3.846153845	7.201590523	0	-0.03076923076	1.944444415	0	0	0	2.469135738	2.807408998	0	5	5.175321369	0	1.944444415	5	1.234567869	1.944444415	0	2.307692308	0	2.469135738	0	2.307692307""";

dat_obj = {}
weights_obj = {}
set_weights_obj = {}

dat_col = {}

for line in dat.split("\n"):
    line = line.split("\t")
    dat_obj[line[0]] = line[1:]

for line in weights.split("\n"):
    line = line.split("\t")
    weights_obj[line[0]] = line[1:]

for line in set_weights.split("\n"):
    line = line.split("\t")
    set_weights_obj[line[0]] = line[1:]

dat_cols = dat_obj["INFO"]



# data_file = open("data.txt", "a", encoding="utf-8")

def add_to_db(json, conn, cur):
    if "characters" not in json or "player" not in json or "uid" not in json["player"] or "nickname" not in json["player"] or "avatar" not in json["player"]:
        print("Invalid JSON")
        return
    char_json = json["characters"]


    scores = {}
    builds = {}
    for character in char_json:
        name = character["name"]
        if name not in dat_obj:
            continue
        # scores[name] = calc_score(character)
        results = calc_score(character)
        char_build = results[1]
        calc_results = results[0]
        # calc_results = calc_score(character)
        scores[name] = calc_results[0]
        builds[name] = char_build

        for i in range(len(lb_types[name]["types"])):
            scores[name + "|" + lb_types[name]["types"][i]] = calc_results[i + 1]["total_dmg"] / 1000
            builds[name + "|" + lb_types[name]["types"][i]] = char_build
        
        # print("Character: ", name, "Score: ", scores[name])

    data_to_insert = [
        (json["player"]["uid"], json["player"]["nickname"], name, json["player"]["avatar"]["icon"], builds[name], scores[name] * 1000)
        for name in scores
    ]

    print("Data to insert: ", data_to_insert)

    try:
        cur.executemany(
            sql.SQL("""INSERT INTO leaderboard (uid, name, character_name, string1, string2, score)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (uid, character_name) DO UPDATE SET
                        name = EXCLUDED.name,
                        score = EXCLUDED.score,
                        string1 = EXCLUDED.string1,
                        string2 = EXCLUDED.string2;"""),
            data_to_insert
        )
        conn.commit()
        # if data_file != None:
        #     for name in scores:
        #         data_file.write(f"{json['player']['uid']},{name},{scores[name] * 1000}\n")
        # data_file.flush()
        return True
    except Exception as e:
        print(e)
        conn.rollback()
        return False
    

def calc_score(char_json):
    char_build = ""
    char_build_serialized = ""

    element = char_json["element"]["name"]
    dat_obj_r = copy.deepcopy(dat_obj)
    dat_cols_r = copy.deepcopy(dat_cols)
    weights_obj_r = copy.deepcopy(weights_obj)
    set_weights_obj_r = copy.deepcopy(set_weights_obj)

    # print()

    # dat_cols_r = [(element + "AddedRatio") if (x == "ELEMENTAddedRatio") else x for x in dat_cols_r]

    # dat_obj_r["INFO"] = [(element + "AddedRatio") if (x == "ELEMENTAddedRatio") else x for x in dat_obj_r["INFO"]]
    # weights_obj_r[element + "AddedRatio"] = weights_obj_r["ELEMENTAddedRatio"]
    # del weights_obj_r["ELEMENTAddedRatio"]

    # char_build["r"] = ""
    char_build = ""

    score = 0
    relics = char_json["relics"]
    stats = {}
    for key in weights_obj_r:
        stats[key] = 0
    for relic in relics:
        
        id = int(relic["id"]) % 10000
        relic_dat = chr(id) + "" + chr(relic["rarity"]*100+relic["level"])
        # if(char_json["name"] == "The Herta"):
            # print("Relic ID", relic["id"], "Rarity", relic["rarity"], "Level", relic["level"], id, chr(id))
            # print("Relic Dat", relic_dat)

        # print("Relic", str(relic))

        if relic["main_affix"]["type"] in stats:
            stats[relic["main_affix"]["type"]] += relic["main_affix"]["value"]
            relic_dat += (chr(property_hash[relic["main_affix"]["type"]]*1000 + 
                              round(relic["main_affix"]["value"] / float(weights_obj_r[relic["main_affix"]["type"]][0]) * 10)))

        for key in relic["sub_affix"]:
            if key["type"] in stats:
                stats[key["type"]] += key["value"]
                relic_dat += (chr(property_hash[key["type"]]*100 + round(key["value"] / float(weights_obj_r[key["type"]][0]) * 10)))
                # print("Relic", relic["id"], "Sub Affix", key["type"], "Value", key["value"], "Weight", weights_obj_r[key["type"]][0], 
                #       "Score Contribution", round(key["value"] / float(weights_obj_r[key["type"]][0]) * 10), "Count", key["count"], key["step"])
        # if (char_json["name"] == "The Herta"):
        #     print("Relic Dat", relic_dat)
        char_build += relic_dat + "relic"
    # substring
    char_build = char_build[:len(char_build) - 5]  # remove last "relic"


    for key in stats:
        if key not in weights_obj_r:
            print("wtfffff", key)
            continue
        score += stats[key] / float(weights_obj_r[key][0]) * float(dat_obj_r[char_json["name"]][dat_cols_r.index(key)])

    # char_build["sets"] = ""
    relic_sets = char_json["relic_sets"]
    for relic_set in relic_sets:
        if ((relic_set["id"] + "|" + str(relic_set["num"])) in set_weights_obj_r["INFO"]) and (char_json["name"] in set_weights_obj_r):
            score += float(set_weights_obj_r[char_json["name"]][set_weights_obj_r["INFO"].index(relic_set["id"] + "|" + str(relic_set["num"]))])
    #     char_build["sets"] += (relic_set["id"] + "|" + str(relic_set["num"]) + "?")
    # char_build["sets"] = char_build["sets"].rstrip("?")


    returnScore = [score]

    lb_types_ = lb_types[char_json["name"]]
    for i in range(len(lb_types_["types"])):
        returnScore.append(lb_types_["calculation_function"][i](stats, relic_sets))

    return [returnScore, char_build]
    
