from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os
from pydantic import BaseModel
import requests
import time
import copy

dat = """INFO	HPDelta	AttackDelta	DefenceDelta	HPAddedRatio	AttackAddedRatio	DefenceAddedRatio	SpeedDelta	CriticalChanceBase	CriticalDamageBase	StatusProbabilityBase	StatusResistanceBase	BreakDamageAddedRatioBase	HealRatioBase	ELEMENTAddedRatio	SPRatioBase
Seele	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0.7	0
Dan Heng \u2022 Imbibitor Lunae	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0.7	0
The Herta	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0.7	0
Feixiao	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	1	0
Firefly	0	0.2	0	0	0.7	0	1	0	0	0	0	1	0	0	0
Aglaea	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0.7	0"""

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
ELEMENTAddedRatio	0.0388803	0.03499227	0.03110424
SPRatioBase	0.0194394	0.01749546	0.01555152"""

dat_obj = {}
weights_obj = {}

for line in dat.split("\n"):
    line = line.split("\t")
    dat_obj[line[0]] = line[1:]

for line in weights.split("\n"):
    line = line.split("\t")
    weights_obj[line[0]] = line[1:]

dat_cols = dat_obj["INFO"]

def add_to_db(json, conn, cur):
    if "characters" not in json or "player" not in json or "uid" not in json["player"] or "nickname" not in json["player"]:
        return
    char_json = json["characters"]

    scores = {}
    for character in char_json:
        name = character["name"]
        if name not in dat_obj:
            continue
        scores[name] = calc_score(character)

    data_to_insert = [
        (json["player"]["uid"], json["player"]["nickname"], name, "", "", scores[name] * 1000)
        for name in scores
    ]

    try:
        cur.executemany(
            sql.SQL("""INSERT INTO leaderboard (uid, name, character_name, string1, string2, score)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (uid, character_name) DO UPDATE SET
                        name = EXCLUDED.name,
                        score = EXCLUDED.score;"""),
            data_to_insert
        )
        conn.commit()
        return True
    except Exception as e:
        print(e)
        conn.rollback()
        return False
    

def calc_score(char_json):
    element = char_json["element"]["name"]
    dat_obj_r = copy.deepcopy(dat_obj)
    dat_cols_r = copy.deepcopy(dat_cols)
    weights_obj_r = copy.deepcopy(weights_obj)

    dat_cols_r = [(element + "AddedRatio") if (x == "ELEMENTAddedRatio") else x for x in dat_cols_r]

    dat_obj_r["INFO"] = [(element + "AddedRatio") if (x == "ELEMENTAddedRatio") else x for x in dat_obj_r["INFO"]]
    weights_obj_r[element + "AddedRatio"] = weights_obj_r["ELEMENTAddedRatio"]
    del weights_obj_r["ELEMENTAddedRatio"]

    score = 0
    relics = char_json["relics"]
    stats = {}
    for key in weights_obj_r:
        stats[key] = 0
    for relic in relics:
        if relic["main_affix"]["type"] in stats:
            stats[relic["main_affix"]["type"]] += relic["main_affix"]["value"]
        for key in relic["sub_affix"]:
            if key["type"] in stats:
                stats[key["type"]] += key["value"]

    for key in stats:
        if key not in weights_obj_r:
            print("wtfffff", key)
            continue
        score += stats[key] / float(weights_obj_r[key][0]) * float(dat_obj_r[char_json["name"]][dat_cols_r.index(key)])
    
    print("Character: ", char_json["name"], "Score: ", score)
    return score
    
