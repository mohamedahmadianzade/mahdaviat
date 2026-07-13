export default function BookCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-emerald/10 bg-white p-4 shadow-soft">
      <div className="flex gap-4">
        <div className="skeleton h-32 w-24 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2.5 py-1">
          <div className="skeleton h-4 w-3/4" /><div className="skeleton h-3 w-1/2" /><div className="skeleton h-3 w-2/3" /><div className="skeleton h-3 w-1/3" />
        </div>
      </div>
      <div className="skeleton mt-3 h-3 w-full" /><div className="skeleton mt-1.5 h-3 w-5/6" />
      <div className="mt-3 flex justify-between"><div className="skeleton h-5 w-16 rounded-full" /><div className="skeleton h-5 w-12 rounded-full" /></div>
    </div>
  );
}
