'use client'

interface ResultDetailsProps {
  plate?: string | null
  type?: string | null
  brand?: string | null
  color?: string | null
}

export function ResultDetails({ plate, type, brand, color }: ResultDetailsProps) {
  if (!plate) {
    return (
      <div className="w-full bg-card border border-border rounded-lg p-6 min-h-40 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">KHÔNG CÓ DỮ LIỆU</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-card border border-border rounded-lg p-6 space-y-4">
  {/* Phần BIỂN SỐ - Giữ nổi bật ở trên */}
  <div className="space-y-2 pb-4 border-b border-border">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      BIỂN SỐ
    </p>
    <p className="text-3xl font-bold text-green-700 font-mono bg-border/30 rounded px-3 py-2 text-center">
      {plate || '---'}
    </p>
  </div>

  {/* Phần chi tiết - Layout Label trái, Result phải */}
  <div className="space-y-4 pt-2">
    {/* Dòng LOẠI XE */}
    <div className="flex justify-between items-center">
      <p className="text-xs font-semibold text-muted-foreground uppercase">
        LOẠI XE
      </p>
      <p className="text-base font-medium text-foreground">
        {type || '—'}
      </p>
    </div>

    {/* Dòng HIỆU */}
    <div className="flex justify-between items-center border-t border-border/50 pt-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase">
        HIỆU
      </p>
      <p className="text-base font-medium text-foreground">
        {brand || '—'}
      </p>
    </div>

    {/* Dòng MÀU SẮC */}
    <div className="flex justify-between items-center border-t border-border/50 pt-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase">
        MÀU SẮC
      </p>
      <p className="text-base font-medium text-foreground">
        {color || '—'}
      </p>
    </div>
  </div>
</div>
  )
}
