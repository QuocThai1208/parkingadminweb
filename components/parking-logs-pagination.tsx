'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ParkingLogsPaginationProps {
  currentPage: number
  totalPages: number
  totalEntries: number
  entriesPerPage: number
  onPageChange: (page: number) => void
  onEntriesPerPageChange: (entries: number) => void
}

export function ParkingLogsPagination({
  currentPage,
  totalPages,
  totalEntries,
  entriesPerPage,
  onPageChange,
  onEntriesPerPageChange,
}: ParkingLogsPaginationProps) {
  const startIndex = (currentPage - 1) * entriesPerPage + 1
  const endIndex = Math.min(currentPage * entriesPerPage, totalEntries)

  const pageNumbers = []
  const maxPagesToShow = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex items-center justify-between py-4 px-2 border-t border-border flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Hiển thị mỗi trang:</span>
        <select
          value={entriesPerPage}
          onChange={(e) => onEntriesPerPageChange(Number(e.target.value))}
          className="px-2 py-1 border border-border rounded bg-card text-foreground text-sm"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <span className="text-sm text-muted-foreground">
        Hiển thị {startIndex} đến {endIndex} của {totalEntries} bản ghi
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="text-muted-foreground px-2">...</span>}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-muted-foreground px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
