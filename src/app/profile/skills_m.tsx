import Image from "next/image";

export default function SkillsM({
  skills,
  skill_trees,
  rank,
  rankIcons,
}: {
  skills: any;
  skill_trees: any;
  rank: number;
  rankIcons: any;
}) {
  function unsaturatedColor(hex: string) {
    hex = hex.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return (
      "#" +
      (r * 0.3).toString(16).padStart(2, "0") +
      (g * 0.3).toString(16).padStart(2, "0") +
      (b * 0.3).toString(16).padStart(2, "0")
    );
  }
  return (
    <div className="w-fit bg-b1 rounded-lg py-3 px-8 flex items-center">
      <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center items-center h-fit w-[280px]">
        <div className="font-extrabold text-2xl text-w1 text-center w-full">
          SKILLS
        </div>
        {skills.slice(0, 4).map((skill: any) => {
          console.log(skills);
          return (
            <div className="w-fit h-fit block">
              <Image
                src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${skill["icon"]}`}
                width={50}
                height={50}
                alt={skill["name"]}
                style={
                  skill["level"] >= skill["max_level"] * 0.66
                    ? {
                        boxShadow: `0 0 10px 5px ${skills[0]["element"]["color"]} inset, 0 0 5px 1px ${skills[0]["element"]["color"]}`,
                      }
                    : {}
                }
                className="rounded-full"
              />
              <div
                className="font-bold text-center"
                style={
                  skill["level"] >= skill["max_level"] * 0.66
                    ? {
                        color: skills[0]["element"]["color"],
                      }
                    : {
                        color: "#898989",
                      }
                }
              >
                {skill["level"]}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-fit">
        <div className="w-[365px] flex flex-wrap gap-x-5 justify-center items-center mx-auto">
          <div className="font-extrabold text-base text-w1 text-center w-full">
            {" "}
            EIDOLONS{" "}
          </div>
          {rankIcons.map((icon: any, index: number) => {
            return (
              <div className="w-fit h-fit block">
                <Image
                  src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${icon}`}
                  width={36}
                  height={36}
                  alt={`Rank ${index + 1}`}
                  style={{
                    boxShadow:
                      index < rank
                        ? `0 0 10px 5px ${skills[0]["element"]["color"]} inset, 0 0 5px 1px ${skills[0]["element"]["color"]}`
                        : "",
                  }}
                  className="rounded-full"
                />
                <div
                  className="font-bold text-center"
                  style={{
                    color:
                      index < rank ? skills[0]["element"]["color"] : "#898989",
                  }}
                >
                  {`E${index + 1}`}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between w-[345px] mx-auto">
          <div className="flex flex-wrap gap-x-5 justify-center items-center w-fit">
            <div className="font-bold text-sm text-w1 text-center w-full">
              MAJOR TRACE
            </div>
            {[2, 4, 6].map((val, index) => {
              return (
                <div className="w-fit h-fit block">
                  <Image
                    src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${
                      skill_trees[index + 4]["icon"]
                    }`}
                    width={26}
                    height={26}
                    alt={skill_trees[index + 4]["name"]}
                    style={
                      skill_trees[index + 4]["level"] >=
                      skill_trees[index + 4]["max_level"]
                        ? {
                            boxShadow: `0 0 5px 2px ${skills[0]["element"]["color"]} inset, 0 0 2px 1px ${skills[0]["element"]["color"]}`,
                          }
                        : {}
                    }
                    className="rounded-full"
                  />
                  <div
                    className="font-bold text-center"
                    style={{
                      color: skills[0]["element"]["color"],
                    }}
                  >
                    {`A${val}`}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-5 justify-center items-center">
            <div className="font-bold text-sm text-w1 text-center w-full">
              MINOR TRACE
            </div>
            {Object.values(
              skill_trees
                .slice(8, skill_trees.length)
                .reduce((acc: any, obj: any) => {
                  if (!acc[obj.icon]) {
                    acc[obj.icon] = { ...obj }; // First instance
                  } else {
                    acc[obj.icon].level += obj.level; // Sum values
                    acc[obj.icon].max_level += obj.max_level; // Sum maxvalues
                  }
                  return acc;
                }, {})
            ).map((obj: any) => (
              <div className="w-fit h-fit block">
                <Image
                  src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${obj.icon}`}
                  width={26}
                  height={26}
                  alt={obj.icon}
                  style={
                    obj.level >= obj.max_level
                      ? {
                          boxShadow: `0 0 5px 2px ${skills[0]["element"]["color"]} inset, 0 0 2px 1px ${skills[0]["element"]["color"]}`,
                        }
                      : {}
                  }
                  className="rounded-full"
                />
                <div
                  className="font-bold text-center"
                  style={
                    obj.level >= obj.max_level
                      ? {
                          color: skills[0]["element"]["color"],
                        }
                      : {
                          color: "#898989",
                        }
                  }
                >
                  {`${obj.level}/${obj.max_level}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
