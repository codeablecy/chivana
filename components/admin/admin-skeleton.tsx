export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
      <div className="flex gap-4 p-4 border-b border-border">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-border last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-muted/60 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-4">
          <div className="h-3 bg-muted rounded w-2/3 mb-3" />
          <div className="h-8 bg-muted/60 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 lg:p-8 max-w-2xl animate-pulse">
      <div className="flex flex-col gap-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i}>
            <div className="h-3 bg-muted rounded w-24 mb-2" />
            <div className="h-10 bg-muted/50 rounded w-full" />
          </div>
        ))}
        <div className="h-10 bg-primary/20 rounded w-40 mt-2" />
      </div>
    </div>
  )
}

export function PostsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 bg-muted rounded w-48" />
              <div className="h-5 bg-muted/60 rounded w-16" />
            </div>
            <div className="h-3 bg-muted/40 rounded w-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 bg-muted/50 rounded w-20" />
            <div className="h-8 bg-muted/50 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
