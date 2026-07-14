export default function BookCardSkeleton() {
  return (
    <div className="flex w-full flex-col overflow-hidden overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
      {/* Cover skeleton */}
      <div className="skeleton h-52 w-full rounded-none" />

      {/* Info skeleton */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="mt-auto flex gap-2 pt-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
