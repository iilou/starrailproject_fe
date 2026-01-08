import { InsertEmoticon } from "@mui/icons-material";

interface HeaderLinkProps {
  href: string;
  name: string;
  isCurrentPage: boolean;
}

export default function HeaderLink({ href, name, isCurrentPage }: HeaderLinkProps) {
  return (
    /*
         * <div
                key={item.name}
                style={{
                  lineHeight: "36px",
                  textShadow: "0 0 25px #000,0 0 25px #000",
                }}
                className={`w-60 text-[13px] text-center h-9 font-bold text-[#e1e1e1] cursor-pointer ${
                  item.link == current ? "bg-[#0d0d0d]" : "bg-[#1A1947]"
                } transition-all duration-100 m1_2:hidden m1_2:group-hover:block`}
                onMouseEnter={(e) => {
                  if (item.link != current) {
                    e.currentTarget.style.backgroundColor = "#23234b";
                    e.currentTarget.style.boxShadow = "0px 0px 3px 1px #d3d3d341";
                    e.currentTarget.style.fontWeight = "900";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.link != current) {
                    e.currentTarget.style.backgroundColor = "#1A1947";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.fontWeight = "700";
                    e.currentTarget.style.color = "#e1e1e1";
                  }
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = "0px 0px 0px 1px #ffffff inset";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow =
                    item.link == current ? "0px 0px 3px 1px #d3d3d341" : "none";
                }}
                onClick={() => {
                  if (item.link !== current) {
                    router.push(item.link);
                  }
                }}>
                <span>{item.name}</span>
              </div>
         * 
         */

    <a
      key={name}
      className={`w-40 text-sm text-center h-full font-bold text-[#e1e1e1] cursor-pointer flex items-center justify-center no-underline ${
        isCurrentPage ? "bg-[#121212]" : "bg-[#1A1947] hover:bg-[#23234b]  hover:text-[#ffffff]"
      } transition-all duration-100 m1_2:hidden m1_2:group-hover:block`}
      href={href}>
      <span>{name}</span>
    </a>
  );
}
