const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const source = fs.readFileSync(path.join(__dirname, "../src/lib/admin-data.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
const loaded = { exports: {} };
new Function("exports", "module", compiled.outputText)(loaded.exports, loaded);
const { filterAdminRows, adminPage, sumAmount, customerWalletTotal, customerCreditTotal } = loaded.exports;

const rows = Array.from({ length: 45 }, (_, index) => ({
  id: index + 1, user_email: "customer@example.com", amount: "100.25", charge: "100.25",
  status: index < 25 ? "completed" : "pending", type: index % 2 ? "debit" : "credit",
  created_at: index < 25 ? "2026-09-22T10:00:00Z" : "2026-09-23T10:00:00Z",
}));
const emptyFilters = { query: "", status: "", type: "", from: "", to: "" };
const filtered = filterAdminRows(rows, { ...emptyFilters, status: "completed", from: "2026-09-22", to: "2026-09-22" });
assert.equal(filtered.length, 25);
assert.equal(sumAmount(filtered, row => row.charge), 2506.25);
assert.equal(adminPage(filtered, 1).rows.length, 20);
assert.equal(adminPage(filtered, 2).rows.length, 5);
assert.equal(adminPage(filtered, 99).page, 2);
assert.equal(adminPage(rows, 3).first, 41);
assert.equal(adminPage(rows, 3).last, 45);
const credits = filterAdminRows(rows, { ...emptyFilters, status: "completed", type: "credit" });
assert.equal(credits.length, 13);
assert.equal(sumAmount(credits, row => row.amount), 1303.25);
assert.equal(filterAdminRows(rows, { ...emptyFilters, query: "CUSTOMER@EXAMPLE.COM" }).length, 45);
const none = filterAdminRows(rows, { ...emptyFilters, from: "2026-09-24" });
assert.equal(sumAmount(none, row => row.amount), 0);
assert.deepEqual(adminPage(none, 4), { page: 1, pages: 1, rows: [], first: 0, last: 0 });
const users = [{ email: " Bornorbang@Gmail.com ", wallet_balance: "999999999" }, { email: "customer@example.com", wallet_balance: "120.50" }];
assert.equal(customerWalletTotal(users), 120.5);
users[1].wallet_balance = "20.50";
assert.equal(customerWalletTotal(users), 20.5);
assert.equal(customerWalletTotal([]), 0);
const activity = [...rows, { ...rows[0], id: 46, user_email: " Bornorbang@Gmail.com ", amount: "999999999" }];
assert.equal(customerCreditTotal(activity), 23 * 100.25);
const filteredActivity = filterAdminRows(activity, { ...emptyFilters, status: "completed", from: "2026-09-22", to: "2026-09-22" });
assert.equal(customerCreditTotal(filteredActivity), 13 * 100.25);
assert.equal(filteredActivity.length, 26); // Excluded credits remain in the audit table.
assert.equal(customerCreditTotal(filterAdminRows(activity, { ...emptyFilters, query: "bornorbang@gmail.com" })), 0);
assert.equal(customerCreditTotal(filterAdminRows(activity, { ...emptyFilters, type: "debit" })), 0);
console.log("Admin filters, totals, pagination and excluded-wallet checks passed.");
