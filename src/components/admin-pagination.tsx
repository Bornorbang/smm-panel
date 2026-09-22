import { ADMIN_PAGE_SIZE } from "@/lib/admin-data";

export function AdminPagination({ page, pages, first, last, total, onChange }: { page: number; pages: number; first: number; last: number; total: number; onChange: (page: number) => void }) {
  return <nav className="admin-pagination" aria-label="Table pagination">
    <span>Showing {first}–{last} of {total} · {ADMIN_PAGE_SIZE} per page</span>
    <div><button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button><span aria-live="polite">Page {page} of {pages}</span><button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button></div>
  </nav>;
}
