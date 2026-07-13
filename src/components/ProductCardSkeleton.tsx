export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="flex flex-1 flex-col p-4">
        <div className="skeleton h-4 w-3/4" /><div className="skeleton mt-2 h-3 w-full" /><div className="skeleton mt-1.5 h-3 w-5/6" />
        <div className="mt-auto pt-4"><div className="skeleton mb-3 h-4 w-1/3" /><div className="skeleton h-9 w-full rounded-xl" /></div>
      </div>
    </div>
  );
}
