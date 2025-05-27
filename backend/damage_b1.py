import math

# Relic Set Stats
relic_set_stats = {
    101_2: {"HealRatioBase": 0.1},
    102_2: {"AttackAddedRatio": 0.12},
    102_4: {"SpeedAddedRatio": 0.06},
    103_2: {"DefenceAddedRatio": 0.15},
    104_2: {"IceAddedRatio": 0.1},
    105_2: {"PhysicalAddedRatio": 0.1},
    107_2: {"FireAddedRatio": 0.1},
    108_2: {"QuantumAddedRatio": 0.1},
    109_2: {"ThunderAddedRatio": 0.1},
    110_2: {"WindAddedRatio": 0.1},
    111_2: {"BreakDamageAddedRatioBase": 0.16},
    111_4: {"BreakDamageAddedRatioBase": 0.16},
    112_2: {"ImaginaryAddedRatio": 0.1},
    113_2: {"HPAddedRatio": 0.12},
    114_2: {"SpeedAddedRatio": 0.06},
    116_2: {"AttackAddedRatio": 0.12},
    117_4: {"CriticalChanceBase": 0.04},
    118_2: {"BreakDamageAddedRatioBase": 0.16},
    119_2: {"BreakDamageAddedRatioBase": 0.16},
    120_2: {"AttackAddedRatio": 0.12},
    120_4: {"CriticalChanceBase": 0.06},
    121_2: {"SpeedAddedRatio": 0.06},
    122_2: {"CriticalChanceBase": 0.08},
    123_2: {"AttackAddedRatio": 0.12},
    124_2: {"QuantumAddedRatio": 0.1},
    124_4: {"SpeedAddedRatio": -0.08},
}

relic_planar_stats = {
    301_2: {"AttackAddedRatio": 0.12},
    302_2: {"HPAddedRatio": 0.12},
    303_2: {"StatusProbabilityBase": 0.1},
    304_2: {"DefenceAddedRatio": 0.15},
    305_2: {"CriticalDamageBase": 0.16},
    306_2: {"CriticalChanceBase": 0.08},
    307_2: {"BreakDamageAddedRatioBase": 0.16},
    308_2: {"SPRatioBase": 0.05},
    309_2: {"CriticalChanceBase": 0.08},
    310_2: {"StatusResistanceBase": 0.1},
    311_2: {"AttackAddedRatio": 0.12},
    312_2: {"SPRatioBase": 0.05},
    313_2: {"CriticalChanceBase": 0.04},
    314_2: {"AttackAddedRatio": 0.12},
    316_2: {"SpeedAddedRatio": 0.06},
    317_2: {"SPRatioBase": 0.05},
    318_2: {"CriticalDamageBase": 0.16},
    319_2: {"HPAddedRatio": 0.12},
    320_2: {"SpeedAddedRatio": 0.06},
}

relic_set_combined = {
    "101_2": {"HealRatioBase": 0.1},
    "102_2": {"AttackAddedRatio": 0.12},
    "102_4": {"SpeedAddedRatio": 0.06},
    "103_2": {"DefenceAddedRatio": 0.15},
    "104_2": {"IceAddedRatio": 0.1},
    "105_2": {"PhysicalAddedRatio": 0.1},
    "107_2": {"FireAddedRatio": 0.1},
    "108_2": {"QuantumAddedRatio": 0.1},
    "109_2": {"ThunderAddedRatio": 0.1},
    "110_2": {"WindAddedRatio": 0.1},
    "111_2": {"BreakDamageAddedRatioBase": 0.16},
    "111_4": {"BreakDamageAddedRatioBase": 0.16},
    "112_2": {"ImaginaryAddedRatio": 0.1},
    "113_2": {"HPAddedRatio": 0.12},
    "114_2": {"SpeedAddedRatio": 0.06},
    "116_2": {"AttackAddedRatio": 0.12},
    "117_4": {"CriticalChanceBase": 0.04},
    "118_2": {"BreakDamageAddedRatioBase": 0.16},
    "119_2": {"BreakDamageAddedRatioBase": 0.16},
    "120_2": {"AttackAddedRatio": 0.12},
    "120_4": {"CriticalChanceBase": 0.06},
    "121_2": {"SpeedAddedRatio": 0.06},
    "122_2": {"CriticalChanceBase": 0.08},
    "123_2": {"AttackAddedRatio": 0.12},
    "124_2": {"QuantumAddedRatio": 0.1},
    "124_4": {"SpeedAddedRatio": -0.08},
    "301_2": {"AttackAddedRatio": 0.12},
    "302_2": {"HPAddedRatio": 0.12},
    "303_2": {"StatusProbabilityBase": 0.1},
    "304_2": {"DefenceAddedRatio": 0.15},
    "305_2": {"CriticalDamageBase": 0.16},
    "306_2": {"CriticalChanceBase": 0.08},
    "307_2": {"BreakDamageAddedRatioBase": 0.16},
    "308_2": {"SPRatioBase": 0.05},
    "309_2": {"CriticalChanceBase": 0.08},
    "310_2": {"StatusResistanceBase": 0.1},
    "311_2": {"AttackAddedRatio": 0.12},
    "312_2": {"SPRatioBase": 0.05},
    "313_2": {"CriticalChanceBase": 0.04},
    "314_2": {"AttackAddedRatio": 0.12},
    "316_2": {"SpeedAddedRatio": 0.06},
    "317_2": {"SPRatioBase": 0.05},
    "318_2": {"CriticalDamageBase": 0.16},
    "319_2": {"HPAddedRatio": 0.12},
    "320_2": {"SpeedAddedRatio": 0.06},
}

def def_calc(self_level, enemy_level, def_ignore):
    return (self_level + 20) / ((enemy_level + 20) * (1 - def_ignore) + self_level + 20)



def seele_solo(stats, sets_ids):
    # print("Seele Solo Damage Calculation")
    # print("===================================")
    # print("param: stats, sets_ids")
    # print("stats: ", stats)
    # print("sets_ids: ", sets_ids)
    # print("===================================")

    # Damage: 3x skill 1x ult 1x basic, no extenal buff, 2 skill w/ ult buff
    # Light cone: In the Night, E0, S1
    # Considered Relics Sets:


    # Seele Base Stats important for damage calc
    level = 80
    enemy_level = 95
    atk_b = 582 + 640
    spd_b = 115
    crit_chance = 0.05 + 0.18
    crit_damage = 0.5 # in reality, 1.5x multiplier, but this is easier for calculations

    skill_ratio = 2.2
    ult_ratio = 4.5
    basic_ratio = 1.0

    # add stats from traces
    atk_p = 1.28 # 28% from traces
    crit_damage += 0.24 # 24% from traces

    # add relic set effects (long)
    spd_p = 1
    skill_p = 1
    basic_p = 1
    ult_p = 1
    def_ignore = 0
    res_ignore = 0
    vulnerabilty = 0

    glacial = False
    scholar = False
    glamoth = False

    # for set_id in sets_ids:
    for set in sets_ids:
        set_id = set["id"] + "_" + str(set["num"])
        if set_id in relic_set_combined:
            for stat, value in relic_set_combined[set_id].items():
                if stat in stats:
                    stats[stat] += value
                else:
                    stats[stat] = value

        if set_id == "104_4":
            glacial = True
        elif set_id == "108_4":
            def_ignore += 0.15
        elif set_id == "122_4":
            skill_p += 0.2
            ult_p += 0.2
            scholar = True

        if set_id == "306_2":
            ult_p += 0.15
        elif set_id == "309_2":
            skill_p += 0.2
            basic_p += 0.2
        elif set_id == "311_2":
            glamoth = True
        elif set_id == "313_2":
            crit_damage += 0.12
        

    # add relic stats
    crit_chance += stats["CriticalChanceBase"]
    crit_damage += stats["CriticalDamageBase"]
    quantum = stats["QuantumAddedRatio"]
    speed_d = stats["SpeedDelta"]
    spd_p += stats.get("SpeedAddedRatio", 0)
    atk_p += stats["AttackAddedRatio"]
    atk_d = stats["AttackDelta"]

    # start combo
    # skill -> ult -> skill -> basic -> (buff off) -> skill
    # in_game_stats["spd%"] = 0.25
    # spd = in_game_stats["spd"] * (1 + in_game_stats["spd%"]) + stats["SpeedDelta"]
    spd_p += 0.25
    spd = spd_b * spd_p + speed_d
    
    # stat dependant buffs
    lc_buff = max(min(math.floor((spd - 100)/10), 6), 0)
    lc_buff_crit = 0.12 * lc_buff
    lc_buff_dmg = 0.06 * lc_buff

    if glamoth and spd > 160:
        quantum += 0.18
    elif glamoth and spd > 135:
        quantum += 0.12

    #skill 1
    dmg_1 = skill_ratio * (atk_b * atk_p + atk_d) * (1 + crit_chance*crit_damage) * (quantum + skill_p + lc_buff_dmg)
    dmg_1 *= def_calc(level, enemy_level, def_ignore) * 0.9 * 1 # def ignore * res * vulnerabilty

    # ult
    resurgence_buff_qua = 0.8
    resurgence_buff_res = 0.2

    if glacial:
        crit_damage += 0.25
    if scholar:
        skill_p += 0.25

    dmg_2 = ult_ratio * (atk_b * atk_p + atk_d) * (1 + crit_chance*(crit_damage + lc_buff_crit)) * (quantum + ult_p + resurgence_buff_qua)
    dmg_2 *= def_calc(level, enemy_level, def_ignore) * (0.9 + resurgence_buff_res) * 1 # def ignore * res * vulnerabilty

    # skill 2
    dmg_3 = skill_ratio * (atk_b * atk_p + atk_d) * (1 + crit_chance*crit_damage) * (quantum + skill_p + lc_buff_dmg + resurgence_buff_qua)
    dmg_3 *= def_calc(level, enemy_level, def_ignore) * (0.9 + resurgence_buff_res) * 1 # def ignore * res * vulnerabilty

    if scholar:
        skill_p -= 0.25

    # basic
    dmg_4 = basic_ratio * (atk_b * atk_p + atk_d) * (1 + crit_chance*crit_damage) * (quantum + basic_p + lc_buff_dmg + resurgence_buff_qua)
    dmg_4 *= def_calc(level, enemy_level, def_ignore) * (0.9 + resurgence_buff_res) * 1 # def ignore * res * vulnerabilty

    # skill 3
    # no resurgence buff
    dmg_5 = skill_ratio * (atk_b * atk_p + atk_d) * (1 + crit_chance*crit_damage) * (quantum + skill_p + lc_buff_dmg + resurgence_buff_qua)
    dmg_5 *= def_calc(level, enemy_level, def_ignore) * (0.9 + resurgence_buff_res) * 1 # def ignore * res * vulnerabilty

    # total damage
    total_dmg = dmg_1 + dmg_2 + dmg_3 + dmg_4 + dmg_5

    # print("===================================")
    # print("Seele Solo Damage Calculation Results")
    # print("skill 1: ", dmg_1)
    # print("ult: ", dmg_2)
    # print("skill 2: ", dmg_3)
    # print("basic: ", dmg_4)
    # print("skill 3: ", dmg_5)
    # print("total damage: ", total_dmg)

    return {
        "dmg_1": dmg_1,
        "dmg_2": dmg_2,
        "dmg_3": dmg_3,
        "dmg_4": dmg_4,
        "dmg_5": dmg_5,
        "total_dmg": total_dmg
    }



def herta_tribbie_aven(stats, sets_ids):
    # print("The Herta + (Anaxa + Tribbie + Aventurine) Damage Calculation")
    # print("===================================")
    # print("param: stats, sets_ids")
    # print("stats: ", stats)
    # print("sets_ids: ", sets_ids)
    # print("===================================")

    # Damage: 1x regular skill, (99 inspiration + 42 stack) -> 1x ult 1x enhanced skill

    # Light cone: Into the Unreachable Veil, E0, S1
    # HP
    # 952.56
    # ATK
    # 635.04
    # DEF
    # 463.05

    # Base Stats
    # HP
    # 1164.24
    # ATK
    # 679.14
    # DEF
    # 485.1
    level = 80
    enemy_level = 95
    atk_b = 679.14 + 635.04
    spd_b = 99
    crit_chance = 0.05 + 0.12
    crit_damage = 0.5 # in reality, 1.5x multiplier, but this is easier for calculations

    # Motion Value Calculation
    # 2 target 42/99 stack, calc single target dmg on 42 stack target
    # skill 70 + 70 + 70
    skill_ratio = (0.7 + 0.7 + 0.7)
    # ult 200 + 99
    ult_ratio = (2.0 + 0.99)
    # enhanced skill 80 + 80 + 80 + (16 * 42 + 40)
    enhanced_skill_ratio = (0.8 + 0.8 + 0.8 + (0.16 * 42 + 0.4))

    # add stats from traces
    atk_p = 1.18
    spd_d = 5
    ice_dmg = 0.224

    # add relic set effects (long)
    # add relic set effects (long)
    skill_p = 1
    ult_p = 1
    def_ignore = 0
    res_ignore = 0
    vulnerabilty = 0

    glacial = False
    scholar = False
    glamoth = False

    # for set_id in sets_ids:
    for set in sets_ids:
        set_id = set["id"] + "_" + str(set["num"])
        if set_id in relic_set_combined:
            # print("set_id", set_id)
            for stat, value in relic_set_combined[set_id].items():
                if stat in stats:
                    stats[stat] += value
                else:
                    stats[stat] = value

        if set_id == "104_4":
            glacial = True
        elif set_id == "108_4":
            def_ignore += 0.2
        elif set_id == "122_4":
            skill_p += 0.2
            ult_p += 0.2
            scholar = True

        if set_id == "306_2":
            ult_p += 0.15
        elif set_id == "309_2":
            # print("rutalent")
            skill_p += 0.2
        elif set_id == "311_2":
            glamoth = True
        elif set_id == "314_2":
            crit_chance += 0.12
        elif set_id == "313_2":
            crit_damage += 0.12
        
    # add stats
    crit_chance += stats["CriticalChanceBase"]
    crit_damage += stats["CriticalDamageBase"]
    ice_dmg += stats["IceAddedRatio"]
    spd_d += stats["SpeedDelta"]
    spd_p = stats.get("SpeedAddedRatio", 0) + 1
    atk_p += stats["AttackAddedRatio"]
    atk_d = stats["AttackDelta"]


    # tribbie
    res_ignore += 0.25
    vulnerabilty += 0.3
    crit_damage += 0.48

    # anaxa
    ice_dmg += 0.5
    def_ignore += 0.12

    # aventurine
    vulnerabilty += 0.15

    # self buffs
    spd = spd_b * spd_p + spd_d
    if glamoth and spd > 160:
        ice_dmg += 0.18
    elif glamoth and spd > 135:
        ice_dmg += 0.12
    crit_damage += 0.8
    ice_dmg += 0.6
    atk_p += 0.8
    
    # print("stats", "skill_ratio", skill_ratio, "ult_ratio", ult_ratio, "enhanced_skill_ratio", enhanced_skill_ratio,
    #         "atk_b", atk_b, "atk_p", atk_p, "atk_d", atk_d, "spd_b", spd_b, "spd_p", spd_p,
    #         "crit_chance", crit_chance, "crit_damage", crit_damage, "ice_dmg", ice_dmg,
    #         "def_ignore", def_ignore, "res_ignore", res_ignore, "vulnerabilty", vulnerabilty,
    #         "skill_p", skill_p, "ult_p", ult_p)

    # start combo
    # skill -> ult -> enhanced skill
    skill_1 = skill_ratio * (atk_b * atk_p + atk_d) * (1 + crit_chance*crit_damage) * (ice_dmg + skill_p) 
    skill_1 *= (1 + vulnerabilty) * def_calc(level, enemy_level, def_ignore) * (0.9 + res_ignore)

    if glacial:
        crit_damage += 0.25
    if scholar:
        skill_p += 0.25

    ult = ult_ratio * (atk_b * atk_p + atk_d) * (1 + crit_chance*crit_damage) * (ice_dmg + ult_p)
    # print("ult", ult)
    ult *= (1 + vulnerabilty) * def_calc(level, enemy_level, def_ignore) * (0.9 + res_ignore)

    ice_dmg += 0.5

    enhanced_skill = enhanced_skill_ratio * (atk_b * atk_p + atk_d) * (1 + crit_chance*crit_damage) * (ice_dmg + skill_p)
    # print("enhanced_skill", enhanced_skill)
    enhanced_skill *= (1 + vulnerabilty) * def_calc(level, enemy_level, def_ignore) * (0.9 + res_ignore)

    # total damage
    total_dmg = skill_1 + ult + enhanced_skill
    # print("===================================")
    # print("The Herta + (Anaxa + Tribbie + Aventurine) Damage Calculation Results")
    # print("skill 1: ", skill_1)
    # print("ult: ", ult)
    # print("enhanced skill: ", enhanced_skill)
    # print("total damage: ", total_dmg)
    # print("===================================")
    return {
        "skill_1": skill_1,
        "ult": ult,
        "enhanced_skill": enhanced_skill,
        "total_dmg": total_dmg
    }