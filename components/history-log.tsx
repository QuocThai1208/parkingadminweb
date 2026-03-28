'use client'


export interface HistoryEntry {
  id: string
  plate: string
  owner_name: string
  check_in: string
  check_out: string
}

interface HistoryLogProps {
  entries: HistoryEntry[]
}

export function HistoryLog({ entries }: HistoryLogProps) {
  return (
    <div className="w-full bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          LỊCH SỬ
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto max-h-60">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <p className="text-sm">CHƯA CÓ DỮ LIỆU</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-sm"
              >
                  <p className="font-semibold text-foreground truncate">
                    {entry.plate} - {entry.owner_name}
                  </p>
                <p className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                  <span>Vào xe: </span>{entry.check_in }
                </p>

                <p className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                  <span>Ra xe: </span>{entry.check_out || "---"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
