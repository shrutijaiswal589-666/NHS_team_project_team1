"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState("");

  useEffect(() => {
    setTerm(searchParams.get("q") || "");
  }, [searchParams]);

  return (
    <div className="relative hidden sm:block">
      <input 
        type="text" 
        placeholder="Search regions..." 
        value={term}
        onChange={(e) => {
          const val = e.target.value;
          setTerm(val);
          
          // Instantly update the URL as the user types
          const params = new URLSearchParams(searchParams);
          if (val) {
            params.set("q", val);
          } else {
            params.delete("q");
          }
          // The { scroll: false } prevents the page from jumping
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        className="pl-8 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors w-48 lg:w-64"
      />
      <span className="material-symbols-outlined absolute left-2 top-2.5 text-secondary text-sm">search</span>
    </div>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="w-48 lg:w-64 h-10 bg-surface-container-low rounded-lg animate-pulse"></div>}>
      <SearchInput />
    </Suspense>
  );
}