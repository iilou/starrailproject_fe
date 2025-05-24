import Image from "next/image";

export default function TierRow({
  rows,
  tierInfo,
  index,
  router,
  parition = true,
  showTags = false,
  showDetails = false,
}: {
  rows: any;
  tierInfo: any;
  index: number;
  router: any;
  parition?: boolean;
  showTags?: boolean;
  showDetails?: boolean;
}) {
  return (
    <div
      className='flex w-full h-fit justify-center items-start gap-[0.5vw] py-[0.5vw] rounded-md
      m1_4:flex-wrap m1_4: pt-0
      '
      style={{
        boxShadow: `0 0 1px 1px ${tierInfo["color"]}44, 0 0 1px 1px ${tierInfo["color"]}44, 0 0 0px 1px ${tierInfo["color"]}44 inset, 0 0 0px 1px ${tierInfo["color"]}44 inset`,
      }}>
      <div
        className='w-[9vw] flex flex-col justify-center items-center
        m1_4:w-full m1_4:gap-[0.5vw]
      '>
        <div
          className='w-[9vw] aspect-square flex justify-center items-center rounded-md text-[1.5vw] font-extrabold bg-[#020202]
          m1_4:w-full m1_4:h-[5vw] m1_4:rounded-lg m1_4:text-[3.5vw]
          '
          style={{
            // minWidth: "100px",
            color: tierInfo["color"],
            textShadow: `0 0 15px ${tierInfo["color"]}`,
            boxShadow: `0 0 3px 1px ${tierInfo["color"]}`,
          }}>
          <div>{tierInfo["name"] + " - " + tierInfo["name_alt"]}</div>
        </div>
        {showDetails && (
          <div
            className='bg-[#1a1a1a] mt-[0.6vw] w-[8.7vw] px-[1vw] py-[0.2vw] rounded-md text-[0.65vw] leading-[0.8vw]  text-[#a3a3a3]
            m1_4:w-[90%] m1_4:mt-[0.6vw] m1_4:px-[2vw] m1_4:py-[0.5vw] m1_4:text-[2.3vw] m1_4:leading-[2.5vw] m1_4:bg-[#00000000] m1_4:text-[#c7c7c7]
          '>
            <div className='text-center font-bold w-full'>{tierInfo["description"]}</div>
          </div>
        )}
      </div>
      <div
        className='w-full flex justify-start items-start flex-wrap rounded-md gap-[0.5vw]
        m1_4:gap-[2vw] m1_4:flex-wrap m1_4:justify-start m1_4:items-start m1_4:py-[3vw]
        '
        style={{
          height: "fit-content",
          // minHeight: "max(100px, 9vw)",
          minHeight: "9vw",
        }}>
        {(parition ? ["dps", "subdps", "support", "sustain"] : ["dps,subdps,support,sustain"]).map(
          (tagGroup: any, i: number) => {
            // process groupings
            const width = parition ? "w-[24%] m1_4:w-[48%]" : "w-[100%]";
            const rowsFiltered = rows.filter((row: any) => {
              const tags = row["tag"];
              const tagGroupSplit = tagGroup.split(",");
              for (let i = 0; i < tags.length; i++)
                for (let j = 0; j < tagGroupSplit.length; j++)
                  if (tags[i] === tagGroupSplit[j]) return true;
              return false;
            });

            if (rowsFiltered.length === 0) return null;

            // group blocks
            return (
              <div
                className={`flex justify-start items-start flex-wrap ${width} bg-[#3d3b8aa1] hover:bg-[#3d3b8ac1] rounded-md h-full brightness-[1] hover:brightness-[1.1] transition-all pl-[0.4vw]
                m1_4:gap-[2vw] m1_4:pl-[2vw] m1_4:py-[4vw]
                  `}
                key={i}>
                {rowsFiltered.map((row: any, i: number) => {
                  return (
                    <div
                      key={i}
                      className='w-fit flex flex-col justify-center items-center my-[0.3vw] pt-[0.8vw] pb-[0.4vw] hover:shadow-[0_0_1px_2px_#ffffff] hover:cursor-pointer rounded-md relative'>
                      <div
                        className='w-[1.7vw] aspect-square flex justify-center items-center top-0 absolute bg-[#0a0a0a] rounded-full translate-x-[2.5vw] translate-y-[-0vw] text-[0.5vw] font-extrabold text-[#e7e7e7]
                          m1_4:w-[5vw] m1_4:aspect-square m1_4:translate-x-[8.9vw] m1_4:translate-y-[-1.5vw] m1_4:text-[2.4vw] m1_4:text-[#c7c7c7] m1_4:bg-[#171717]
                        '>
                        <div className='w-fit h-fit'>
                          <span className='m1_4:hidden'>E</span>
                          {row["assumed_eidolon"]}
                        </div>
                      </div>
                      <div
                        className='w-[5vw] aspect-square flex justify-center items-center rounded-lg shadow-[0_0_3px_2px_#030303_inset]
                          m1_4:w-[19vw] m1_4:aspect-square m1_4:rounded-lg m1_4:shadow-[0_0_3px_2px_#030303_inset]
                          '
                        onClick={(e: any) => {
                          if (e.detail === 2) {
                            router.push(`/i/${row["id"]}`);
                          }
                        }}>
                        <img
                          src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/icon/character/${row["id"]}.png`}
                          width={128}
                          height={128}
                          alt={`Character Icon: ${row["name"]}`}
                          className={`w-[5vw] aspect-square rounded-lg text-[0.5vw]
                                m1_4:w-[19vw] m1_4:aspect-square m1_4:rounded-lg m1_4:text-[0.8vw]
                              `}
                        />
                      </div>
                      <div
                        className='w-[8vw] flex flex-col justify-center items-center text-[0.6vw]
                          m1_4:w-[19vw] m1_4:text-[2.1vw]
                        '>
                        <div className='text-center  font-bold w-full'>{row["name"]}</div>
                        <div
                          className='w-full flex flex-wrap justify-center items-center gap-[0.1vw] mt-[0.3vw]
                            m1_4:gap-[0.3vw] m1_4:mt-[0.7vw]
                          '>
                          {row["tag"].map((tag: any, i: number) => {
                            const tag_colors: any = {
                              dps: "#db5b5b",
                              subdps: "#d3db5b",
                              support: "#5ba4db",
                              sustain: "#99db5b",
                            };
                            return (
                              <div
                                key={i}
                                className='w-fit h-fit bg-[#121212] rounded-md text-[0.6vw] font-extrabold px-[0.8vw] py-[0.2vw] text-[#5ba4db]
                                    m1_4:text-[1.9vw] m1_4:font-bold m1_4:w-[100%] m1_4:text-center
                                  '
                                style={{
                                  color: tag in tag_colors ? tag_colors[tag] : "#c7c7c7",
                                  maxWidth: "100%",
                                }}>
                                {tag}
                              </div>
                            );
                          })}
                        </div>

                        {showTags && (
                          <div className='w-full flex flex-wrap justify-center items-center gap-[0.1vw] mt-[0.3vw]'>
                            {row["tag_detail"].map((tag: any, i: number) => {
                              if (tag === "") tag = "to be added";
                              return (
                                <div
                                  key={i}
                                  className='w-fit h-fit bg-[#1a1a1a99] rounded-md text-[0.6vw] font-medium px-[0.6vw] py-[0.05vw] text-[#c7c7c7]
                                    m1_4:text-[1.5vw] m1_4:font-bold m1_4:px-[2vw] m1_4:py-[0.2vw]
                                    '
                                  style={{
                                    color: tag === "to be added" ? "#a1a1a1" : "#c7c7c7",
                                    opacity: tag === "to be added" ? 0.5 : 1,
                                    maxWidth: "100%",
                                  }}>
                                  {tag}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {showDetails && (
                          <div
                            className='w-[90%] flex flex-wrap justify-center items-center gap-[0.3vw] mt-[0.3vw] text-center text-[0.6vw] font-normal text-[#a1a1a1]
                              m1_4:text-[2.1vw] m1_4:font-bold m1_4:w-[100%] m1_4:leading-[2.8vw] m1_4:mt-[1vw] m1_4:text-left m1_4:text-[#c7c7c7]
                            '>
                            {row["rational"]}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
