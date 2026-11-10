"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (term.trim()) {
      params.set("query", term.trim());
    } else {
      params.delete("query");
    }

    push(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="meeting-search">
      <label htmlFor="meeting-search">Search the meeting archive</label>
      <input
        key={searchParams.get("query") ?? ""}
        id="meeting-search"
        type="search"
        placeholder="Search by speaker, leader, or meeting type..."
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(event) => handleSearch(event.target.value)}
        aria-label="Search meetings"
        className="w-full rounded-2xl border border-purple-200 bg-white px-5 py-4 text-base text-purple-950 shadow-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
      />
    </div>
  );
}
