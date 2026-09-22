export type AdminRow = Record<string, string | number | null>;
export const ADMIN_PAGE_SIZE = 20;
export const EXCLUDED_WALLET_EMAIL = "bornorbang@gmail.com";

export function sumAmount<T>(rows: T[], value: (row: T) => string | number | null) {
  return rows.reduce((total, row) => {
    const amount = Number(value(row));
    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);
}

export function filterAdminRows(rows: AdminRow[], filters: { query: string; status: string; type: string; from: string; to: string }) {
  const needle = filters.query.trim().toLowerCase();
  return rows.filter(row => {
    const created = String(row.created_at ?? "").slice(0, 10);
    return (!needle || Object.values(row).join(" ").toLowerCase().includes(needle))
      && (!filters.status || String(row.status ?? "") === filters.status)
      && (!filters.type || String(row.type ?? "") === filters.type)
      && (!filters.from || created >= filters.from)
      && (!filters.to || created <= filters.to);
  });
}

export function adminPage<T>(rows: T[], requestedPage: number) {
  const pages = Math.max(1, Math.ceil(rows.length / ADMIN_PAGE_SIZE));
  const page = Math.max(1, Math.min(requestedPage, pages));
  const start = (page - 1) * ADMIN_PAGE_SIZE;
  return { page, pages, rows: rows.slice(start, start + ADMIN_PAGE_SIZE), first: rows.length ? start + 1 : 0, last: Math.min(start + ADMIN_PAGE_SIZE, rows.length) };
}

export function customerWalletTotal<T extends { email: string; wallet_balance: string | number }>(users: T[]) {
  return sumAmount(users.filter(user => user.email.trim().toLowerCase() !== EXCLUDED_WALLET_EMAIL), user => user.wallet_balance);
}

export const adminMoney = (amount: number) => `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
