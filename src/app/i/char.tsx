import Image from "next/image";
import { useState, useEffect } from "react";

import SkillNew from "./skill_new";
import { Icon } from "@mui/material";

export default function Char({ id, json }: { id: string; json: any }) {
  const [processedData, setProcessedData] = useState<any>(null);

  const getMostRecentVersion = (json: any) => {};

  const processDesc = (desc: string, maxLevel: number, params: any) => {
    // console.log(desc, maxLevel, params);
    // const descsplitparams_percent = desc.split("[p]");

    // for (let i = 0; i < descsplitparams_percent.length; i++) {
    //   const num = parseInt(descsplitparams_percent[i].split("#")[descsplitparams_percent[i].split("#").length - 1]);
    //   if (num) {
    //     descsplitparams_percent[i] = descsplitparams_percent[i].replace("#" + num, params[maxLevel - 1][num - 1] * 100 + "%");
    //   }
    // }
    // desc = descsplitparams_percent.join("");

    // const descsplitparams_float = desc.split("[f]");
    // for (let i = 0; i < descsplitparams_float.length; i++) {
    //   const num = parseInt(descsplitparams_float[i].split("#")[descsplitparams_float[i].split("#").length - 1]);
    //   if (num) {
    //     descsplitparams_float[i] = descsplitparams_float[i].replace("#" + num, params[maxLevel - 1][num - 1] + "");
    //   }
    // }
    // desc = descsplitparams_float.join("");

    return desc;
  };

  const checkGlobalPassive = (id: string, skill: any) => {
    if (id.startsWith("2") && skill["Desc"].startsWith("After obtaining")) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const newProcessData: any = {
      skill: {},
    };

    if (json._avatarskill_) {
      for (const key in json._avatarskill_) {
        const id = key;
        const versions = Object.keys(json._avatarskill_[key]);
        const last_version = versions[versions.length - 1];
        const skill = json._avatarskill_[key][last_version];
        var skill_type = skill.Type;

        // Global Passive Check
        if (checkGlobalPassive(id, skill)) skill_type = "Global Passive";

        if (skill_type === "") continue;

        console.log(skill_type);
        if (!(skill_type in newProcessData.skill)) {
          newProcessData.skill[skill_type] = {
            MaxLevel: skill.MaxLevel,
            Desc: [processDesc(skill.Desc, skill.MaxLevel, skill.Params)],
            Params: [skill.Params],
            Icon: skill.Icon,
            Tag: skill.Tag,
            Name: [skill.Name],
            SPAdd: skill.SPAdd,
            Stance: skill.Stance,
            ID: [id],
          };
        } else {
          newProcessData.skill[skill_type].Desc.push(processDesc(skill.Desc, skill.MaxLevel, skill.Params));
          newProcessData.skill[skill_type].Name.push(skill.Name);
          newProcessData.skill[skill_type].Params.push(skill.Params);
          newProcessData.skill[skill_type].ID.push(id);
        }

        console.log(skill);
      }
    }

    if (json._avatarskilltree_) {
      const tree = json._avatarskilltree_[id];
      newProcessData.asc = {};
      if (tree) {
        const versions = Object.keys(tree);
        const last_version = versions[versions.length - 1];
        const real_tree = tree[last_version];
        ["Tree1", "Tree2", "Tree3"].forEach((treeKey, index) => {
          const skill = real_tree[treeKey];
          newProcessData.asc[treeKey] = {
            Desc: skill.Desc,
            Icon: skill.Icon,
            Name: skill.Name,
            Type: "Ascension " + (index * 2 + 2),
          };
        });
        newProcessData.stat_inc = real_tree["Add"];
      }
    }

    if (json._avatarrank_) {
      newProcessData["rank"] = {};
      for (const key in json._avatarrank_) {
        const id = key;
        const versions = Object.keys(json._avatarrank_[key]);
        const last_version = versions[versions.length - 1];
        const eidolon = json._avatarrank_[key][last_version];
        const rank = eidolon.Rank;

        newProcessData["rank"][rank] = {
          Desc: eidolon.Desc,
          Icon: eidolon.Icon,
          Name: eidolon.Name,
          Type: "Eidolon " + rank,
          Rank: rank,
          id: id,
        };
      }
    }

    setProcessedData(newProcessData);
    console.log(newProcessData);
  }, [json]);

  return (
    <div>
      {/* <div>{JSON.stringify(json._avatarskill_)}</div>
      <div>{JSON.stringify(json._avatarskilltree_)}</div>
      <div>{JSON.stringify(json._avatarrank_)}</div> */}
      {processedData &&
        Object.keys(processedData.skill).map((key) => {
          const desc = [];
          for (let i = 0; i < processedData.skill[key].Desc.length; i++) {
            desc.push({
              name: processedData.skill[key].Name[i],
              desc: processedData.skill[key].Desc[i],
            });
          }
          const isMemo = key.includes("Memo");
          return (
            <SkillNew
              key={key}
              isMemo={isMemo}
              isMax={true}
              icon={id + "/" + processedData.skill[key].Icon + ".png"}
              elementColor={"#ffffff"}
              name={key}
              desc={desc}
              level={processedData.skill[key].MaxLevel}
              params={processedData.skill[key].Params}
              type_text={key}
              width={476}
            />
          );
        })}
      {processedData &&
        processedData.asc &&
        Object.keys(processedData.asc).map((key) => {
          return (
            <SkillNew
              key={key}
              isMemo={false}
              isMax={true}
              icon={id + "/" + processedData.asc[key].Icon + ".png"}
              elementColor={"#ffffff"}
              name={processedData.asc[key].Name}
              desc={[{ desc: processedData.asc[key].Desc }]}
              level={processedData.asc[key].Type.replace("Ascension ", "A")}
              type_text={processedData.asc[key].Name}
              width={476}
            />
          );
        })}
      {processedData &&
        processedData.rank &&
        Object.keys(processedData.rank).map((key) => {
          return (
            <SkillNew
              key={key}
              isMemo={false}
              isMax={true}
              icon={id + "/" + processedData.rank[key].Icon + ".png"}
              elementColor={"#ffffff"}
              name={processedData.rank[key].Name}
              desc={[{ desc: processedData.rank[key].Desc }]}
              level={processedData.rank[key].Type.replace("Eidolon ", "E")}
              type_text={processedData.rank[key].Name}
              width={476}
            />
          );
        })}
    </div>
  );
}
