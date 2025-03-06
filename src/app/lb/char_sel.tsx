// param function on handling character selection
export default function CharSel({
  onCharSelect,
  charList,
}: {
  onCharSelect: (char: string) => void;
  charList: { [key: string]: number };
}) {
  return (
    <div className="group flex flex-col items-center w-fit relative z-30 mx-auto">
      <div className="w-[532px] bg-b6 text-2xl text-center py-2 text-b3 font-bold rounded-lg">
        SELECT CHARACTER
      </div>
      <div className="group-hover:flex hidden opacity-0 group-hover:opacity-100 flex-col justify-center w-fit px-3 bg-b3 rounded-s-lg gap-y-1 py-3 items-center h-fit absolute transition-all mt-12">
        {Object.keys(charList).map((key) => {
          return (
            <div
              key={key}
              className="w-fit bg-b6 text-b3 text-center py-1 text-lg font-extrabold px-5 rounded-lg hover:bg-b4 active:bg-b6 transition-all"
              onClick={() => onCharSelect(key)}
            >
              {key}
            </div>
          );
        })}
      </div>
    </div>
  );
}
