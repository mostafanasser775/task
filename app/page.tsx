import Link from "next/link";
import type { OmdbSearchResponse, MovieSummary } from "../types/movie";
import SearchForm from "../components/SearchForm";
import ImageWithFallback from "../components/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import QueryPagination from "@/components/QueryPagination";

type SearchParams = { q?: string; page?: string; type?: string; y?: string };

async function fetchMovies(searchParams: SearchParams): Promise<OmdbSearchResponse> {
  const { q = "", page = "1", type = "", y = "" } = searchParams;
  if (!q) return { Response: "False", Error: "Enter a search term" };

  const url = new URL(`http://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`);
  url.searchParams.set("s", q);
  url.searchParams.set("page", page);
  if (type) url.searchParams.set("type", type);
  if (y) url.searchParams.set("y", y);

  const res = await fetch(url.toString(), { cache: "no-store" });
  return (await res.json());
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const page = Number(sp.page ?? "1");
  const data = q ? await fetchMovies(sp) : undefined;
  const results: MovieSummary[] = data?.Search || [];
  const total = Number(data?.totalResults || 0);
  const totalPages = total ? Math.ceil(total / 10) : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">OMDb Search</h1>

      <SearchForm initialQuery={q} />

      {q && data?.Response === "False" && (
        <p className="text-sm text-red-600">{data.Error || "No results"}</p>
      )}

      {results?.length > 0 && (
        <>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((m) => {
              const listParams = new URLSearchParams();
              if (q) listParams.set("q", q);
              if (page) listParams.set("page", String(page));
              const href = `/movie/${m.imdbID}?${listParams.toString()}`;
              return (
                <li key={m.imdbID}>
                  <Link href={href} className="block">
                    <Card className="overflow-hidden transition-shadow hover:shadow-md p-0">
                      <CardContent className="p-0">
                        <AspectRatio ratio={2/3} className="bg-muted">
                          <ImageWithFallback
                            src={m.Poster}
                            alt={m.Title}
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </CardContent>
                      <CardHeader className="space-y-1 p-3">
                        <CardTitle className="text-base line-clamp-2">{m.Title}</CardTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary">{m.Year}</Badge>
                          {m.Type ? <Badge variant="outline" className="capitalize">{m.Type}</Badge> : null}
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <QueryPagination q={q} page={page} totalPages={totalPages} />
          )}
        </>
      )}
    </div>
  );
}
