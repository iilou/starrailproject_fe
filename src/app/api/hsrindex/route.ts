import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const file = searchParams.get("file");      // e.g. "Avatar"
  const vars = searchParams.get("var");       // e.g. "_avatar,_item"

  if (!file || !vars) {
    return NextResponse.json({ error: "Missing file or var query" }, { status: 400 });
  }

  const varNames = vars.split(",").map((v) => v.trim());
  const url = `https://homdgcat.wiki/data/EN/${file}.js`;

  try {
    const jsText = await fetch(url).then((r) => r.text());

    // Sandbox the variables
    const sandbox: Record<string, any> = {};
    const fn = new Function("sandbox", `with (sandbox) { ${jsText}; return { ${varNames.map(v => `"${v}": typeof ${v} !== "undefined" ? ${v} : null`).join(",")} }; }`);
    const result = fn(sandbox);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch or evaluate", detail: String(err) },
      { status: 500 }
    );
  }
}
