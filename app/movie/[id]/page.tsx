import Link from "next/link";
import ImageWithFallback from "../../../components/ImageWithFallback";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

async function fetchDetails(id: string) {
  const url = new URL(`http://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&i=${id}&plot=full`);
  const res = await fetch(url.toString(), { cache: "no-store" });
  return (await res.json());
}

export default async function MoviePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const data = await fetchDetails(id);
  const hasError = data?.Response === "False";

  const usp = new URLSearchParams();
  if (sp?.q) usp.set("q", sp.q);
  if (sp?.page) usp.set("page", sp.page);
  const backHref = usp.toString() ? `/?${usp.toString()}` : "/";

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={backHref}>Search</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {hasError ? (
        <p className="text-sm text-red-600">{data.Error || "Movie not found"}</p>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1 overflow-hidden bg-muted/10 backdrop-blur-sm p-0">
              <CardContent className="p-0">
                <div className="relative  ">
                  <ImageWithFallback 
                    src={data.Poster} 
                    alt={data.Title} 
                    className="w-full h-full object-cover rounded-lg shadow-xl" 
                    width={400}
                    height={600}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  {data.Title} {data.Year ? 
                    <span className="text-muted-foreground text-2xl">({data.Year})</span> : null}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {data.Type ? <Badge variant="outline" className="capitalize font-medium">{data.Type}</Badge> : null}
                  {data.Rated ? <Badge variant="secondary" className="font-medium">{data.Rated}</Badge> : null}
                  {data.Runtime ? <Badge variant="secondary" className="font-medium">{data.Runtime}</Badge> : null}
                  {data.Language ? <Badge variant="secondary" className="font-medium">{data.Language}</Badge> : null}
                  {data.Released ? <Badge variant="secondary" className="font-medium">{data.Released}</Badge> : null}
                </div>
              </div>

              <div className="space-y-4">
                {data.Genre && (
                  <p className="text-base"><span className="text-muted-foreground font-medium">Genres:</span> {data.Genre}</p>
                )}
                {data.Director && (
                  <p className="text-base"><span className="text-muted-foreground font-medium">Director:</span> {data.Director}</p>
                )}
                {data.Actors && (
                  <p className="text-base"><span className="text-muted-foreground font-medium">Actors:</span> {data.Actors}</p>
                )}
              </div>

              <Separator className="my-6" />

              {data.Plot && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Plot</h2>
                  <p className="leading-relaxed text-base md:text-lg text-muted-foreground">{data.Plot}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
