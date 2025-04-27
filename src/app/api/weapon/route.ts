import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const weaponId = searchParams.get("id");

  if (!weaponId || isNaN(Number(weaponId))) {
    return NextResponse.json({ error: "Invalid or missing weapon ID" }, { status: 400 });
  }

  const url = `https://homdgcat.wiki/data/EN/Weapon/${weaponId}.js`;

  try {
    const jsText = await fetch(url).then((res) => {
      if (!res.ok) throw new Error(`Remote fetch failed with status ${res.status}`);
      return res.text();
    });

    const sandbox = {};
    const fn = new Function(
      "sandbox",
      `with (sandbox) {
         ${jsText};
         return typeof _weaponskill_ !== "undefined" ? _weaponskill_["${weaponId}"] ?? null : null;
       }`
    );

    const result = fn(sandbox);

    if (!result) {
      return NextResponse.json({ error: `_weaponskill_ for ${weaponId} not found` }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch or evaluate _weaponskill_",
        detail: err.message || String(err),
      },
      { status: 500 }
    );
  }
}
