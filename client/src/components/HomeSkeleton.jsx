// src/components/HomeSkeleton.jsx
import React from "react";

// Local Skeleton helper component
const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-[var(--hover-bg-strong)]/60 ${className}`}
      {...props}
    />
  );
};

export const HomeSkeleton = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--bg-primary)]">
      {/* ================= HEADER SKELETON ================= */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[68px] sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Skeleton className="hidden h-8 w-16 rounded-lg sm:block" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="hidden h-9 w-20 rounded-lg md:block" />
            <Skeleton className="h-9 w-20 rounded-lg sm:w-24" />
          </div>
        </div>
      </header>

      {/* ================= HERO SKELETON ================= */}
      <main>
        <section className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-20 text-center sm:px-8 sm:pb-24 sm:pt-28 md:pt-32">
          <Skeleton className="mb-6 h-8 w-44 rounded-full" />

          <Skeleton className="h-10 w-3/4 max-w-lg rounded-xl sm:h-14 sm:max-w-xl md:h-16" />
          <Skeleton className="mt-3 h-10 w-1/2 max-w-sm rounded-xl sm:h-14 sm:max-w-md md:h-16" />

          <div className="mt-6 flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-72 rounded-md sm:w-96 md:w-[480px]" />
            <Skeleton className="h-4 w-60 rounded-md sm:w-80 md:w-[380px]" />
          </div>

          <Skeleton className="mt-8 h-12 w-44 rounded-lg sm:h-14 sm:w-52" />
        </section>

        {/* ================= FEATURE CARDS SKELETON ================= */}
        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-5 pb-20 sm:px-8 md:grid-cols-3 md:gap-5 lg:pb-24">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-6"
            >
              <Skeleton className="mb-5 h-10 w-10 rounded-lg" />
              <Skeleton className="mb-3 h-5 w-3/4 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-5/6 rounded" />
                <Skeleton className="h-3.5 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* ================= FOOTER SKELETON ================= */}
      <footer className="border-t border-[var(--border-primary)] px-5 py-6">
        <Skeleton className="mx-auto h-4 w-48 rounded" />
      </footer>
    </div>
  );
};

export default HomeSkeleton;