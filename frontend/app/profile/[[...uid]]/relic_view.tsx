import RelicL from "./relic_l";
import RelicSetL from "./relicset_l";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  scoreLib,
  scoreSetLib,
  weightLib,
  charIndex,
  charSetIndex,
  weightParse,
} from "../../lib/score";

import Image from "next/image";

export default function RelicView({
  relic_list,
  relic_set_list,
  char_name,
  element,
  elementColor,
}: {
  relic_list: any[];
  relic_set_list: any[];
  char_name: string;
  element: string;
  elementColor: string;
}) {
  const columns = [
    "Item",
    "Name",
    "HPDelta",
    "AttackDelta",
    "DefenceDelta",
    "HPAddedRatio",
    "AttackAddedRatio",
    "DefenceAddedRatio",
    "SpeedDelta",
    "CriticalChanceBase",
    "CriticalDamageBase",
    "StatusProbabilityBase",
    "StatusResistanceBase",
    "BreakDamageAddedRatioBase",
    "HealRatioBase",
    element + "AddedRatio",
    "SPRatioBase",
    "Score",
  ];
  const columnHash: { [key: string]: number } = {};
  for (let i = 0; i < columns.length; i++) {
    columnHash[columns[i]] = i;
  }

  const columnNames = [
    "Item",
    "Name",
    "HP",
    "ATK",
    "DEF",
    "HP%",
    "ATK%",
    "DEF%",
    "SPD",
    "CR%",
    "CD%",
    "EHR%",
    "EFF%",
    "BE%",
    "HEAL%",
    "DMG%",
    "ERR%",
    "Score",
  ];
  const columnMultiplier = [
    0, 0, 1, 1, 1, 100, 100, 100, 1, 100, 100, 100, 100, 100, 100, 100, 100, 1,
  ];
  const columnFixed = [0, 0, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2];
  const columnPercentage = [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0];
  const columnWidth = [80, 150, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 100];
  const columnType = [
    "img",
    "label",
    "stat",
    "stat",
    "stat",
    "stat",
    "stat",
    "stat",
    "stat",
    "stat",
    "stat",
    "stat",
    "stat",
    "stat",
    "stat",
    "stat",
    "stat",
    "score",
  ];

  if (
    columns.length != columnNames.length ||
    columns.length != columnMultiplier.length ||
    columns.length != columnFixed.length ||
    columns.length != columnPercentage.length ||
    columns.length != columnWidth.length ||
    columns.length != columnType.length
  ) {
    throw new Error(
      "columns length mismatch columns:" +
        columns.length +
        " columnNames: " +
        columnNames.length +
        " columnMultiplier: " +
        columnMultiplier.length +
        " columnFixed: " +
        columnFixed.length +
        " columnPercentage: " +
        columnPercentage.length +
        " columnWidth: " +
        columnWidth.length +
        " columnType: " +
        columnType.length
    );
  }

  const [isTable, setIsTable] = useState(false);

  const [rows, setRows] = useState<string[][]>([]);

  const populateMultiplierRow = () => {
    const newMultiplierRow = ["x", "Score", "", ...Array(columns.length - 3).fill(0)];
    for (let key in columnHash) {
      if (charIndex["INFO"].includes(key)) {
        const data_index = charIndex["INFO"].indexOf(key);
        const multiplier: number =
          char_name in charIndex ? parseFloat(charIndex[char_name][data_index]) : 0;
        // console.log(key, multiplier);

        newMultiplierRow[columnHash[key]] = multiplier;
      }
    }
    // console.log(newMultiplierRow);
    // console.log(char_name in charIndex ? charIndex[char_name] : [...Array(columns.length - 1).fill("")]);
    return newMultiplierRow;
  };

  const weight_state = (statName: string, cell: any) => {
    if (cell == "" || cell == 0 || cell == "0") {
      return 0;
    }

    if (isNaN(parseFloat(cell))) return 0;

    const value = parseFloat(cell) / weightParse[statName];
    if (value >= 9.9) return 2;

    // const multiplier = Number(multiplierRow[columnHash[statName]]);
    const multiplier = (statName in columnHash ? multiplierRow[columnHash[statName]] : 0) as number;
    if (multiplier > 0) return 3;

    if (value > 0) return 1;
    return 0;
  };

  const [weightRow, setWeightRow] = useState<any[]>([
    "",
    "Weight",
    ...Array(columns.length - 2).fill(""),
  ]);
  const [multiplierRow, setMultiplierRow] = useState<any[]>(populateMultiplierRow());
  const [multiplierRowOriginal, setMultiplierRowOriginal] = useState<any[]>(
    populateMultiplierRow()
  );
  const [scoreRow, setScoreRow] = useState<any[]>([
    "",
    "Total",
    ...Array(columns.length - 2).fill(""),
  ]);

  const [setScores, setSetScores] = useState<number[]>([]);
  const [setScoresOriginal, setSetScoresOriginal] = useState<number[]>([]);

  const multiplierRowRefs = useRef<any[]>([]);
  const setScoresRefs = useRef<any[]>([]);

  useEffect(() => {
    setMultiplierRow((prev) => {
      // const newMultiplierRow = ["x", "Score", ...(char_name in charIndex ? charIndex[char_name].slice(1) : Array(columns.length - 3).fill(0)), ""];
      // return newMultiplierRow;
      return populateMultiplierRow();
    });
    setMultiplierRowOriginal((prev) => {
      // const newMultiplierRow = ["x", "Score", ...(char_name in charIndex ? charIndex[char_name].slice(1) : Array(columns.length - 3).fill(0)), ""];
      // return newMultiplierRow;
      return populateMultiplierRow();
    });

    setSetScores((prev) => {
      const newSetScores = [
        ...relic_set_list.map((relic_set) => {
          return char_name in charSetIndex
            ? parseFloat(
                parseFloat(
                  charSetIndex[char_name][
                    charSetIndex["INFO"].indexOf(relic_set["id"] + "|" + relic_set["num"])
                  ]
                ).toFixed(1)
              )
            : 0;
        }),
      ];
      return newSetScores;
    });

    setSetScoresOriginal((prev) => {
      const newSetScores = [
        ...relic_set_list.map((relic_set) => {
          return char_name in charSetIndex
            ? parseFloat(
                parseFloat(
                  charSetIndex[char_name][
                    charSetIndex["INFO"].indexOf(relic_set["id"] + "|" + relic_set["num"])
                  ]
                ).toFixed(1)
              )
            : 0;
        }),
      ];
      return newSetScores;
    });
  }, [char_name]);

  useEffect(() => {
    for (let i = 0; i < setScoresRefs.current.length; i++) {
      if (setScoresRefs.current[i]) {
        setScoresRefs.current[i].value = setScores[i];
      }
    }
  }, [setScores]);

  useEffect(() => {
    const newRows: any[] = [];
    const newWeightRow: any[] = ["", "Weight", ...Array(columns.length - 2).fill("")];
    const newScoreRow: any[] = ["", "Total", ...Array(columns.length - 2).fill("")];

    relic_list.forEach((relic: any) => {
      const row = [
        relic["icon"],
        relic["name"].substring(0, 18) + (relic["name"].length > 18 ? "..." : ""),
        ...Array(columns.length - 2).fill(0),
      ];

      if (!(relic["main_affix"] && !(relic["main_affix"]["type"] in columnHash))) {
        const mainAffixType = relic["main_affix"]["type"] as keyof typeof columnHash;
        row[columnHash[mainAffixType]] =
          parseFloat(row[columnHash[mainAffixType]]) + parseFloat(relic["main_affix"]["value"]) ||
          row[columnHash[mainAffixType]];
      }

      relic["sub_affix"].forEach((affix: any) => {
        if (affix["type"] in columnHash) {
          const subAffixType = affix["type"] as keyof typeof columnHash;
          // row[columnHash[subAffixType]] += parseFloat(affix["value"]) || 0;
          row[columnHash[subAffixType]] =
            parseFloat(row[columnHash[subAffixType]]) + parseFloat(affix["value"]) ||
            row[columnHash[subAffixType]];
        }
      });

      // console.log(row);
      // console.log(weightParse);

      const score = row
        .map((value: string, index) => {
          if (columnType[index] == "stat") {
            const scoreType = columns[index] as keyof typeof columnHash;

            // console.log("scoreType", scoreType);

            const base = weightParse[scoreType] || 1;
            if (weightParse[scoreType] == undefined) {
              throw new Error(`weightParse[${scoreType}] is undefined`);
            }

            const weight = parseFloat(value) / Number(base);

            // const multiplier = char_name in charIndex && charIndex["INFO"].includes(scoreType) ? charIndex[char_name][charIndex["INFO"].indexOf(scoreType)] : 0;
            const multiplier = Number(multiplierRow[index]);

            // weightRow[index] = weightRow[index] == "" ? weight : Number(weightRow[index]) + Number(weight);
            newWeightRow[index] =
              newWeightRow[index] == "" ? weight : Number(newWeightRow[index]) + Number(weight);
            // multiplierRow[index] = Number(multiplier);

            const scoreValue = Number(weight) * Number(multiplier);
            // scoreRow[index] = scoreRow[index] == "" ? scoreValue : scoreRow[index] + scoreValue;
            newScoreRow[index] =
              newScoreRow[index] == ""
                ? scoreValue
                : Number(newScoreRow[index]) + Number(scoreValue);
            return scoreValue;
          }
          return 0;
        })
        .reduce((sum, current) => sum + current, 0);

      row[columnHash["Score"]] = score;
      newScoreRow[columnHash["Score"]] =
        newScoreRow[columnHash["Score"]] == "" ? score : newScoreRow[columnHash["Score"]] + score;

      newRows.push(row);
    });
    setRows(newRows);
    setWeightRow(newWeightRow);
    setScoreRow(newScoreRow);

    for (let i = 0; i < multiplierRowRefs.current.length; i++) {
      if (multiplierRowRefs.current[i]) {
        multiplierRowRefs.current[i].value = multiplierRow[i];
      }
    }
  }, [multiplierRow]);

  return (
    <div className='w-fit'>
      {/* <div
        className='bg-[#3d3b8a] text-[#e9e9e9] font-bold text-[14px] hover:font-extrabold hover:text-[16px] text-center w-[280px] mt-2 mx-auto h-[42px] flex items-center justify-center opacity-90 transition-all duration-200 active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] cursor-pointer'
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          setIsTable((prev) => !prev);
        }}>
        <div className='w-full h-full flex items-center justify-center bg-[#020071c2] hover:bg-[#0e0d72a2]  border-[#d7d7d733] border-b-2 border-t-2 py-[1px]'>
          <span>{isTable ? "Relics - Table View" : "Relics - Block View"}</span>
        </div>
      </div> */}
      {/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
      <div
        className={`grid gap-x-[10px] gap-y-[10px] mt-[10px] relative z-[100] grid-cols-[auto,auto,auto,auto] w-[1280px]`}>
        {relic_list.map((relic: any, idx: number) => {
          return (
            <RelicL
              relicJSON={relic}
              charName={char_name}
              element={element}
              elementColor={elementColor}
              key={idx}
            />
          );
        })}
        <div
          className={`${
            isTable ? "hidden" : "flex"
          } flex-col justify-center items-center gap-1  relative z-[100] w-[319px] translate-x-[130px]`}>
          {relic_set_list.map((relic_set: any, idx: number) => {
            return <RelicSetL relicsetJSON={relic_set} charName={char_name} key={idx} />;
          })}
        </div>
      </div>
      {/* -------------------------------------------------------------------------------------------------------------------    RLEIC TABLE HEADER   -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
      {/* <div
        className={`${
          isTable ? "flex" : "hidden"
        } flex-col justify-center bg-[#3d3b8a] opacity-[90%] rounded-lg px-14 py-6 mx-auto items-center gap-1 mt-4 relative z-[100] w-fit overflow-y-hidden`}>
        <table
          className='mx-auto'
          style={{ width: columnWidth.reduce((a, b) => a + b, 0) + 8 * columnWidth.length + "px" }}>
          <thead>
            <tr className='border-b-2 border-t-2 border-[#d7d7d733] bg-[#020071c2] py-1'>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`rounded-md py-2 font-bold text-[13px] hover:bg-[#353385d2] active:bg-[#292E5D] h-fit text-center mx-1  ${
                    column in columnHash && Number(multiplierRow[columnHash[column]]) > 0
                      ? "text-[#f4e135] font-extrabold shadow-[0px_0px_11px_0px_inset_#f4e135e8,_0px_0px_2px_0px_#f4e135e8]"
                      : "text-[#c1c1c1]"
                  }`}
                  style={{ width: columnWidth[index] + "px" }}>
                  {columnNames[index]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='mt-4 text-[11px] '>
            ----------------------------------------------------------------------------------------------------------------    TABLE    -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            <tr className='border-b-[1px] border-t-[1px] border-[#d7d7d733] h-[15px]'>
              {[...Array(columns.length).fill("")].map((a, idx) => (
                <td key={idx}></td>
              ))}
            </tr>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className='border-b-[1px] border-t-[1px] border-[#d7d7d733]'>
                {row.map((cell, cellIndex) => {
                  const color_state = weight_state(columns[cellIndex], cell);
                  return (
                    <td
                      key={cellIndex}
                      className={`rounded-md px-2 py-1 text-center font-extrabold active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] hover:bg-[#4f4ea3] active:bg-[#292E5D] ${
                        // ![0, 1, columns.length - 1].includes(cellIndex) &&
                        columnType[cellIndex] == "stat" &&
                        [
                          "text-[#9a9a9a] font-medium",
                          "text-[#9a9a9a] font-medium",
                          "text-[#f4e135] font-extrabold",
                          "text-[#e0d680] font-extrabold ",
                        ][weight_state(columns[cellIndex], cell)]
                      }
                      `}
                      style={{ width: columnWidth[cellIndex] + "px" }}>
                      {cellIndex != 0 ? (
                        <span className='hover:cursor-pointer hover:underline'>
                          {isNaN(parseFloat(cell)) || cell == "" || (cell == "0" && cellIndex != 1)
                            ? cell
                            : (parseFloat(cell) * columnMultiplier[cellIndex]).toFixed(
                                columnFixed[cellIndex]
                              ) + (columnPercentage[cellIndex] ? "%" : "")}
                        </span>
                      ) : (
                        <div className='w-[26px] h-[26px] mx-auto'>
                          <Image
                            src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${cell}`}
                            width={26}
                            height={26}
                            alt='Relic Icon'
                            className={`w-[26px] h-[26px] `}
                          />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            <tr className='border-b-[1px] border-t-[1px] border-[#d7d7d733] h-[15px]'>
              {[...Array(columns.length).fill("")].map((a, idx) => (
                <td key={idx}></td>
              ))}
            </tr>
            -------------------------------------------------------------------------------------------------------------------   WEIGHT    ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            <tr className='border-b-[1px] border-t-[1px] border-[#d7d7d733]'>
              {weightRow.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`rounded-lg px-2 py-2 text-center active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] hover:bg-[#4f4ea3] active:bg-[#292E5D] `}
                  style={{
                    width: columnWidth[cellIndex] + "px",
                    fontWeight: cellIndex == 1 ? "bold" : "500",
                  }}>
                  <span className='hover:cursor-pointer hover:underline'>
                    {isNaN(parseFloat(cell)) ? cell : cell == 0 ? "-" : parseFloat(cell).toFixed(1)}
                  </span>
                </td>
              ))}
            </tr>
            ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            <tr className='border-b-[1px] border-t-[1px] border-[#d7d7d733]'>
              <td
                key={0}
                className={`rounded-lg px-2 py-2 text-center active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] hover:bg-[#4f4ea3] active:bg-[#292E5D] `}
                style={{ width: columnWidth[0] + "px", fontWeight: "bold" }}>
                <span
                  className='hover:cursor-pointer hover:underline'
                  onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                    if (
                      !multiplierRow.every((value, index) => {
                        return "" + value == "" + multiplierRowOriginal[index];
                      })
                    ) {
                      const newMultiplierRow = [...multiplierRowOriginal];
                      setMultiplierRow(() => newMultiplierRow);
                    }
                  }}>
                  {multiplierRow.every((value, index) => {
                    return "" + value == "" + multiplierRowOriginal[index];
                  })
                    ? "Reset"
                    : "Reset"}
                </span>
              </td>
              <td
                key={1}
                className={`rounded-lg px-2 py-2 text-center active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] hover:bg-[#4f4ea3] active:bg-[#292E5D] `}
                style={{ width: columnWidth[1] + "px", fontWeight: "bold" }}>
                <span className='hover:cursor-pointer hover:underline'>Score</span>
              </td>
              {multiplierRow.slice(2, multiplierRow.length - 1).map((cell, cellIndex) => (
                <td
                  key={cellIndex + 2}
                  className={`rounded-lg px-2 py-2 text-center active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] hover:bg-[#4f4ea3] active:bg-[#292E5D] `}
                  style={{
                    width: columnWidth[cellIndex + 2] + "px",
                    fontWeight: cellIndex == 1 ? "bold" : "400",
                  }}>
                  <input
                    type='number'
                    defaultValue={cell}
                    ref={(el: HTMLInputElement | null) => {
                      multiplierRowRefs.current[cellIndex + 2] = el;
                    }}
                    onBlur={(e) => {
                      const newMultiplierRow = [...multiplierRow];
                      newMultiplierRow[cellIndex + 2] = e.target.value;
                      setMultiplierRow(() => newMultiplierRow);
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter" || e.key === "Tab") {
                        if (
                          isNaN(parseFloat(e.currentTarget.value)) ||
                          parseFloat(e.currentTarget.value) < 0
                        ) {
                          e.currentTarget.value = "0";
                          return;
                        }
                        const newMultiplierRow = [...multiplierRow];
                        newMultiplierRow[cellIndex + 3] = parseFloat(e.currentTarget.value);
                        setMultiplierRow(() => newMultiplierRow);
                      }
                    }}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    className={`bg-transparent text-center w-full font-bold focus:outline-none focus:ring-0 focus:border-b-[1px] focus:border-[#8D92C5] 
                        [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                          columns[cellIndex + 2] in columnHash &&
                          Number(multiplierRow[columnHash[columns[cellIndex + 2]]]) > 0
                            ? "text-[#f4e135] font-extrabold"
                            : "text-[#c1c1c1]"
                        }`}
                  />
                </td>
              ))}
              <td
                key={multiplierRow.length - 1}
                className={`rounded-lg px-2 py-2 text-center active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] hover:bg-[#4f4ea3] active:bg-[#292E5D] text-[#a1a1a1]`}
                style={{ width: columnWidth[multiplierRow.length - 1] + "px", fontWeight: "bold" }}>
                <span className='hover:cursor-pointer hover:underline'></span>
              </td>
            </tr>
            ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            <tr className='border-b-[1px] border-t-[1px] border-[#d7d7d733] h-[15px]'>
              {[...Array(columns.length).fill("")].map((a, idx) => (
                <td key={idx}></td>
              ))}
            </tr>
            ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            <tr className='border-b-[2px] border-t-[2px] border-[#d7d7d733] bg-[#020071c2]'>
              {scoreRow.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`rounded-lg px-2 py-2 text-center active:shadow-[0px_0px_0px_1px_inset_rgb(240,240,240)] hover:bg-[#4f4ea3] active:bg-[#292E5D] `}
                  style={{
                    width: columnWidth[cellIndex] + "px",
                    fontWeight: cellIndex == 1 || cellIndex == scoreRow.length - 1 ? "bold" : "400",
                  }}>
                  <span className='hover:cursor-pointer hover:underline'>
                    {isNaN(parseFloat(cell)) ? cell : cell == 0 ? "-" : parseFloat(cell).toFixed(1)}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div> */}
      {/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
      {/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
      {/* -------------------------------------------------------------------------------------------------------------------------SET TABLE------------------------------------------------------------------------------------------------------------------------------------------------------- */}
      {/* <div
        className={`${
          isTable ? "flex" : "hidden"
        } flex-col justify-center bg-[#3d3b8a] opacity-[90%] rounded-lg px-14 py-6 w-fit mx-auto items-center gap-1 mt-4 relative z-[100]`}>
        <table className='mx-auto w-[800px]'>
          <thead>
            <tr className='border-b-2 border-t-2 border-[#d7d7d733] bg-[#020071c2] py-1'>
              {[
                { name: "Item", width: 95 },
                { name: "Set", width: 95 },
                { name: "Name", width: 212 },
                { name: "Description", width: 500 },
                { name: "Score", width: 112 },
              ].map((column, index) => (
                <th
                  key={index}
                  className='rounded-md py-2 font-bold text-[13px] hover:bg-[#4f4ea3] active:bg-[#292E5D] text-[#e8e8e8] h-fit text-center mx-1'
                  style={{ width: column["width"] + "px" }}>
                  {column["name"]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className='border-b-[1px] border-t-[1px] border-[#d7d7d733] h-[15px]'>
              {[...Array(5).fill("")].map((a, idx) => (
                <td key={idx}></td>
              ))}
            </tr>
            {setScores.map((score: any, index: number) => {
              const relic_set = relic_set_list[index];
              return (
                <tr key={index} className='border-b-[1px] border-t-[1px] border-[#d7d7d733]'>
                  {relic_set && (
                    <>
                      {[
                        <div className='w-[26px] h-[26px] mx-auto'>
                          <Image
                            src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${relic_set["icon"]}`}
                            width={26}
                            height={26}
                            alt='Relic Icon'
                            className={`w-[26px] h-[26px] `}
                          />
                        </div>,
                        <div className='text-center text-[12px] font-bold text-[#f4e135]'>
                          {relic_set["num"] == 2 ? "2-Piece" : "4-Piece"}
                        </div>,
                        relic_set["name"].substring(0, 18) +
                          (relic_set["name"].length > 18 ? "..." : ""),
                        relic_set["desc"].substring(0, 50) +
                          (relic_set["desc"].length > 50 ? "..." : ""),
                        <input
                          type='number'
                          defaultValue={score}
                          ref={(el: HTMLInputElement | null) => {
                            setScoresRefs.current[index] = el;
                          }}
                          onBlur={(e) => {
                            if (
                              isNaN(parseFloat(e.currentTarget.value)) ||
                              parseFloat(e.currentTarget.value) < 0
                            ) {
                              e.currentTarget.value = setScoresOriginal[index].toFixed(2);
                              setSetScores(() => setScoresOriginal);
                              return;
                            }
                            const newSetScores = [...setScores];
                            newSetScores[index] = parseFloat(e.target.value);
                            setSetScores(() => newSetScores);
                          }}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter" || e.key === "Tab") {
                              if (
                                isNaN(parseFloat(e.currentTarget.value)) ||
                                parseFloat(e.currentTarget.value) < 0
                              ) {
                                e.currentTarget.value = setScoresOriginal[index].toFixed(2);
                                setSetScores(() => setScoresOriginal);
                                return;
                              }
                              const newSetScores = [...setScores];
                              newSetScores[index] = parseFloat(e.currentTarget.value);
                              setSetScores(() => newSetScores);
                            }
                          }}
                          onFocus={(e) => {
                            e.target.select();
                          }}
                          className='bg-transparent text-center w-full text-[12px] font-bold text-[#e8e8e8] focus:outline-none focus:ring-0 focus:border-b-[1px] focus:border-[#8D92C5]
                        [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                        />,
                      ].map((cell, cellIndex) => {
                        return (
                          <td
                            key={cellIndex}
                            className={`rounded-lg px-2 py-2 text-center text-[11px] font-medium text-[#d7d7d7] active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] hover:bg-[#4f4ea3] active:bg-[#292E5D] ${
                              cellIndex == 0 ? "w-[26px] h-[26px]" : ""
                            }  hover:cursor-pointer hover:underline`}
                            style={{ width: columnWidth[cellIndex] + "px" }}>
                            {cell}
                          </td>
                        );
                      })}
                      
                    </>
                  )}
                </tr>
              );
            })}
            <tr className='border-b-[1px] border-t-[1px] border-[#d7d7d733] h-[15px]'>
              {[...Array(5).fill("")].map((a, idx) => (
                <td key={idx}></td>
              ))}
            </tr>
            <tr className='border-b-[1px] border-t-[1px] border-[#d7d7d733]'>
              <td
                className='rounded-lg px-2 py-2 text-center text-[12px] active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] hover:bg-[#d7d7d733] active:bg-[#292E5D] '
                onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                  if (
                    !setScores.every((value, index) => {
                      return "" + value == "" + setScoresOriginal[index];
                    })
                  ) {
                    const newSetScores = [...setScoresOriginal];
                    setSetScores((prev) => newSetScores);
                  }
                }}>
                <span className='hover:cursor-pointer hover:underline'>
                  {setScores.every((value, index) => {
                    return "" + value == "" + setScoresOriginal[index];
                  })
                    ? ""
                    : "Reset"}
                </span>
              </td>
              <td></td>
              <td></td>
              <td className='rounded-lg px-5 py-2 text-right text-[12px] text-[#f4e135] font-extrabold active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] hover:bg-[#d7d7d733] active:bg-[#292E5D] '>
                <span className='hover:cursor-pointer hover:underline'>Total</span>
              </td>
              <td className='rounded-lg px-2 py-2 text-center text-[12px] active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] hover:bg-[#d7d7d733] bg-[#020071c2] active:bg-[#292E5D] '>
                <span className='hover:cursor-pointer hover:underline'>
                  {setScores.reduce((a, b) => a + b, 0).toFixed(2)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </div>
  );
}
