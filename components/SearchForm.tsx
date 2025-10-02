"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchForm({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(initialQuery);
  const [type, setType] = useState<string>(params.get("type") ?? "");
  const [year, setYear] = useState<string>(params.get("y") ?? "");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const usp = new URLSearchParams(params?.toString());
    if (q) {
      usp.set("q", q);
      usp.set("page", "1"); // reset page when searching
    } else {
      usp.delete("q");
      usp.delete("page");
    }
    // set filters
    if (type) usp.set("type", type); else usp.delete("type");
    if (year) usp.set("y", year); else usp.delete("y");
    startTransition(() => {
      router.push(`/?${usp.toString()}`);
    });
  };

  return (
    <form className="mb-6" onSubmit={onSubmit}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="text"
          name="q"
          placeholder="Search movies..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 min-w-40"
        />
        <select
          id="type"
          aria-label="Type"
          className="h-9 min-w-28 rounded-md border bg-background px-3 text-sm"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Any type</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="episode">Episode</option>
        </select>
        <Input
          id="year"
          type="number"
          inputMode="numeric"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-28"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
}
