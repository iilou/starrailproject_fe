"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { get_from_tier, get_tiers } from "./tierData";

import Header from "../header";
import BG from "../bg";
import TierRow from "./tierRow";

export default function TierList() {
  const router = useRouter();
  const [parition, setParition] = useState(true);
  const [showTags, setShowTags] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div>
      <Header current='/tier' />
      <div className='z-[10] fixed'>
        <BG />
      </div>
      <div className='flex flex-col w-full h-full justify-center items-center z-[11] relative'>
        <div className='w-[95vw] h-fit flex flex-col justify-start items-center'>
          <div className='w-full h-fit flex justify-center items-center mt-[2vw] '>
            <div className='text-[3vw] font-bold'>Tier List v3.3</div>
          </div>
          <div className='w-[60vw] flex justify-center items-start mb-[1vw] h-[5vw]'>
            {showDetails && (
              <div className='text-[0.7vw] text-center font-bold text-[#c2c2c2] rounded-full px-[2vw] py-[0.2vw]'>
                {"Tier List for HSR v3.3 on 2025-05-09. Characters are ranked based on my interpretation of their value in their best in slot team in a generic Memory of Chaos (MoC) scenario, " +
                  "meaning no specific boss gimmick or blessings will be considered. Characters aren't only weighed against characters within the same class for obvious reasons, e.x. upgrading sustain is far less impactful " +
                  " than upgrading dps pound for pound. Pure Fiction and Apoc Shadow meta are gimmick modes and aren't considered."}
              </div>
            )}
          </div>
          <div className='w-[95vw] h-fit flex justify-end items-center mb-[1vw] gap-[0.2vw]'>
            {/* <div className='text-xl font-bold'>Characters</div> */}
            {[
              {
                text: "Parition",
                setFunction: setParition,
                state: parition,
              },
              {
                text: "Tags",
                setFunction: setShowTags,
                state: showTags,
              },
              {
                text: "Details",
                setFunction: setShowDetails,
                state: showDetails,
              },
            ].map((item, index) => (
              <div
                key={index}
                className='text-[0.7vw] font-bold text-[#c2c2c2] rounded-full px-[2vw] py-[0.2vw] hover:cursor-pointer hover:shadow-[0_0_1px_2px_#ffffff] '
                onClick={() => {
                  item.setFunction((oldpar) => !oldpar);
                }}
                style={{
                  backgroundColor: item.state ? "#3d3b8ac1" : "#121212c1",
                  transition: "0.05s",
                }}>
                {item.text}
              </div>
            ))}
          </div>
          <div
            className='w-full h-fit flex flex-col justify-start items-start gap-[0.5vw]'
            style={{}}>
            {get_tiers().map((tierInfo, index) => {
              const rows = get_from_tier(tierInfo["tier"]);
              // console.log("rows", rows);
              return (
                <TierRow
                  key={index}
                  rows={rows}
                  tierInfo={tierInfo}
                  index={index}
                  router={router}
                  parition={parition}
                  showTags={showTags}
                  showDetails={showDetails}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
