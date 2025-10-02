import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://www.omdbapi.com/";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const i = searchParams.get("i"); // imdb id
    const t = searchParams.get("t"); // title
    const plot = searchParams.get("plot") || "short"; // short | full
    const type = searchParams.get("type") || ""; // movie | series | episode (rarely needed here)
    const y = searchParams.get("y") || ""; // year
    const r = searchParams.get("r") || "json"; // json | xml

    if (!i && !t) {
      return NextResponse.json(
        { Response: "False", Error: "Provide 'i' (imdbID) or 't' (title)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY || process.env.OMDB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { Response: "False", Error: "Missing OMDb API key. Set NEXT_PUBLIC_OMDB_API_KEY or OMDB_API_KEY in .env" },
        { status: 500 }
      );
    }

    const url = new URL(BASE_URL);
    url.searchParams.set("apikey", apiKey);
    if (i) url.searchParams.set("i", i);
    if (t) url.searchParams.set("t", t);
    if (type) url.searchParams.set("type", type);
    if (y) url.searchParams.set("y", y);
    if (plot) url.searchParams.set("plot", plot);
    if (r) url.searchParams.set("r", r);

    const res = await fetch(url.toString(), { cache: "no-store" });
    const data = await res.json();

    return NextResponse.json(data, { status: res.ok ? 200 : 500 });
  } catch (err) {
    return NextResponse.json(
      { Response: "False", Error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
