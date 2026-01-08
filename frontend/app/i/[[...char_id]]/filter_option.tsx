export default function FilterOption({
  item,
  idx,
  includes,
  addAvatarFilter,
  removeAvatarFilter,
  name,
  display,
}: {
  item: string;
  idx: number;
  includes: boolean;
  addAvatarFilter: any;
  removeAvatarFilter: any;
  name: string;
  display: string;
}) {
  const lim = 4;
  const disp_1 = display.length > lim ? display.slice(0, lim) : display;
  const disp_2 = display.length > lim ? display.slice(lim) : null;
  return (
    <div
      key={idx}
      className={`w-32 h-[30px] flex items-center justify-center rounded-lg bg-[#121212]  text-xs font-bold mx-2 my-1 cursor-pointer transition-all duration-150 hover:shadow-[0_0_0px_1px_#ffffffaa]
        m1_4:w-[10vw] m1_4:text-[2.1vw] m1_4:h-[5vw] m1_4:mx-[0.3vw] m1_4:my-[0.3vw]
        ${
          includes ? "bg-[#1c196a] text-[#ffffff] shadow-[0_0_0_1px_#c7c7c7aa]" : "text-[#c7c7c7]"
        }`}
      onClick={() => {
        // addAvatarFilter("Element", item, true);
        if (includes) {
          //   removeAvatarFilter("Element", item, true);
          removeAvatarFilter(name, item, false);
        } else {
          // addAvatarFilter("Element", item, true);
          addAvatarFilter(name, item, true);
        }
      }}>
      {/* {display} */}
      <span>{disp_1}</span>
      {disp_2 ? <span className='m1_4:hidden'>{disp_2}</span> : null}
    </div>
  );
}
