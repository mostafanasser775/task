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
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

async function fetchDetails(id: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_LOCAL_API}api/omdb/details`);
  url.searchParams.set("i", id);
  url.searchParams.set("plot", "full");
  const res = await fetch(url.toString(), { cache: "no-store" });
  return (await res.json()) ;
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 overflow-hidden">
            <CardContent className="p-0">
              <AspectRatio ratio={2/3} className="bg-muted">
                <ImageWithFallback src={data.Poster} alt={data.Title} className="w-full h-full object-cover" />
              </AspectRatio>
            </CardContent>
          </Card>
          <div className="md:col-span-2 space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              {data.Title} {data.Year ? <span className="text-muted-foreground text-xl">({data.Year})</span> : null}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {data.Type ? <Badge variant="outline" className="capitalize">{data.Type}</Badge> : null}
              {data.Rated ? <Badge variant="secondary">{data.Rated}</Badge> : null}
              {data.Runtime ? <Badge variant="secondary">{data.Runtime}</Badge> : null}
              {data.Language ? <Badge variant="secondary">{data.Language}</Badge> : null}
              {data.Released ? <Badge variant="secondary">{data.Released}</Badge> : null}
            </div>

            {data.Genre && (
              <p className="text-sm"><span className="text-muted-foreground">Genres:</span> {data.Genre}</p>
            )}
            {data.Director && (
              <p className="text-sm"><span className="text-muted-foreground">Director:</span> {data.Director}</p>
            )}
            {data.Actors && (
              <p className="text-sm"><span className="text-muted-foreground">Actors:</span> {data.Actors}</p>
            )}

            <Separator className="my-2" />

            {data.Plot && (
              <div className="space-y-2">
                <h2 className="text-xl font-medium">Plot</h2>
                <p className="leading-relaxed text-sm md:text-base">{data.Plot}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
