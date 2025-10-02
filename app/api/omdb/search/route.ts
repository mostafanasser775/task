import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://www.omdbapi.com/";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? searchParams.get("s"); // allow either q or s
    const type = searchParams.get("type") || ""; // movie | series | episode
    const y = searchParams.get("y") || ""; // year
    const page = searchParams.get("page") || "1"; // 1-100

    if (!q) {
      return NextResponse.json(
        { Response: "False", Error: "Missing required query parameter 'q' (search term)." },
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
    url.searchParams.set("s", q);
    if (type) url.searchParams.set("type", type);
    if (y) url.searchParams.set("y", y);
    if (page) url.searchParams.set("page", page);

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
