import RelicL from "./relic_l";
import RelicSetL from "./relicset_l";

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
  return (
    <div className='w-fit'>
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
          className={`flex flex-col justify-center items-center gap-1  relative z-[100] w-[319px] translate-x-[130px]`}>
          {relic_set_list.map((relic_set: any, idx: number) => {
            return <RelicSetL relicsetJSON={relic_set} charName={char_name} key={idx} />;
          })}
        </div>
      </div>
    </div>
  );
}
