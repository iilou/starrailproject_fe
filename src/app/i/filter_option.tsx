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
  return (
    <div
      key={idx}
      className={`w-[100px] h-[30px] flex items-center justify-center rounded-lg bg-[#121212] text-white text-sm font-bold mx-2 my-1 cursor-pointer ${
        includes ? "bg-[#3d3b8a]" : ""
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
      {display}
    </div>
  );
}
