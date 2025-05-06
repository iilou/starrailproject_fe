import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Extracts 'id' from the pathname, assuming it's a dynamic route like /api/char/[id]
  const id = pathname.split('/').pop() || ""; 

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const file = "Avatar";
  const vars = `_avatarskill_,_avatarskilltree_,_avatarrank_`; // updated list

  const varNames = vars.split(",").map((v) => v.trim());
  const url = `https://homdgcat.wiki/data/EN/${file}/${id}.js`;

  try {
    const jsText = await fetch(url).then((r) => r.text());

    const sandbox: Record<string, any> = {};
    const fn = new Function(
      "sandbox",
      `with (sandbox) { ${jsText}; return { ${varNames
        .map((v) => `"${v}": typeof ${v} !== "undefined" ? ${v} : null`)
        .join(",")} }; }`
    );
    const result = fn(sandbox);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch or evaluate", detail: String(err) },
      { status: 500 }
    );
  }
}
