import Image from "next/image";

interface RelicsetJSON {
  icon: string;
  name: string;
  num: number;
  desc: string;
}

export default function RelicsetL({
  relicsetJSON,
}: {
  relicsetJSON: RelicsetJSON;
}) {
  return (
    <div className="flex w-fit h-[75px] justify-center items-center bg-b3 rounded-sm">
      <div className="flex justify-center items-center w-[75px] h-[75px] bg-w2">
        <Image
          src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${relicsetJSON["icon"]}`}
          width={59}
          height={59}
          alt="Relic Set Icon"
        />
      </div>
      <div className="text-y1 text-lg font-bold h-fit w-[67px] text-center py-4">
        {`+${(Math.random() * 20).toFixed(1)}`}
      </div>
      <div className="w-[800px] bg-b4 h-full flex flex-col px-4">
        <div className="text-lg font-extrabold pt-3 text-w1">
          {`${relicsetJSON["name"]} ${relicsetJSON["num"]}pc`}
        </div>
        <div className="text-xs -translate-y-1 text-w2 h-[30px] overflow-y-auto overflow-x-hidden">{`${relicsetJSON["desc"]}`}</div>
      </div>
    </div>
  );
}
