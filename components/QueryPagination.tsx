"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination as UiPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

function buildHref(params: URLSearchParams, q: string, page: number) {
  const usp = new URLSearchParams(params.toString());
  if (q) usp.set("q", q);
  usp.set("page", String(page));
  return `/?${usp.toString()}`;
}

export default function QueryPagination({
  q,
  page,
  totalPages,
}: {
  q: string;
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  const pageWindow = 3;
  const pages: number[] = [];
  for (let p = Math.max(1, page - pageWindow); p <= Math.min(totalPages, page + pageWindow); p++) {
    pages.push(p);
  }

  const go = (p: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(buildHref(params, q, p));
  };

  return (
    <UiPagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={buildHref(params, q, prevPage)} aria-disabled={page === 1} onClick={go(prevPage)} />
        </PaginationItem>
        {pages[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={buildHref(params, q, 1)} onClick={go(1)}>1</PaginationLink>
            </PaginationItem>
            {pages[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}
        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href={buildHref(params, q, p)} isActive={p === page} onClick={go(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href={buildHref(params, q, totalPages)} onClick={go(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext href={buildHref(params, q, nextPage)} aria-disabled={page === totalPages} onClick={go(nextPage)} />
        </PaginationItem>
      </PaginationContent>
    </UiPagination>
  );
}
