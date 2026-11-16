
import { ChevronLeft, ChevronRight } from 'lucide-react'

type MateriPaginationProps = {
  currentPage: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export default function MateriPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: MateriPaginationProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  )

  const safePage = Math.min(
    Math.max(currentPage, 1),
    totalPages
  )

  const startNumber =
    totalItems === 0
      ? 0
      : (safePage - 1) * pageSize + 1

  const endNumber = Math.min(
    safePage * pageSize,
    totalItems
  )

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (page) =>
      totalPages <= 7 ||
      page === 1 ||
      page === totalPages ||
      Math.abs(page - safePage) <= 1
  )

  return (
    <nav
      aria-label="Navigasi halaman katalog"
      className="flex flex-col items-center justify-between gap-4 rounded-xl bg-card p-4 shadow-sm sm:flex-row sm:p-5"
    >
      <div className="text-center text-[13px] text-foreground-muted sm:text-left">
        Menampilkan{' '}
        <strong className="text-foreground">
          {startNumber} - {endNumber}
        </strong>{' '}
        dari{' '}
        <strong className="text-foreground">
          {totalItems}
        </strong>{' '}
        modul pelajaran
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Halaman Sebelumnya"
          disabled={safePage === 1}
          onClick={() => onPageChange(safePage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:bg-muted disabled:text-[#c4c6ce]"
        >
          <ChevronLeft size={18} />
        </button>

        {pages.map((page, index) => (
          <div key={page} className="flex items-center gap-1">
            {index > 0 && page - pages[index - 1] > 1 && (
              <span
                aria-hidden="true"
                className="w-7 text-center text-xs text-[#75777e]"
              >
                ...
              </span>
            )}

            <button
              type="button"
              aria-label={`Halaman ${page}`}
              aria-current={
                page === safePage ? 'page' : undefined
              }
              onClick={() => onPageChange(page)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg font-heading text-xs font-semibold transition-colors ${
                page === safePage
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-foreground-muted hover:bg-muted hover:text-foreground'
              }`}
            >
              {page}
            </button>
          </div>
        ))}

        <button
          type="button"
          aria-label="Halaman Selanjutnya"
          disabled={safePage === totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:bg-muted disabled:text-[#c4c6ce]"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  )
}
