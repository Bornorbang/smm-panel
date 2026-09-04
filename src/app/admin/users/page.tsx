"use client";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  locked: number;
  wallet_balance: string;
  created_at: string;
};
export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [query,setQuery]=useState("");const[role,setRole]=useState("");const[access,setAccess]=useState("");const[from,setFrom]=useState("");const[to,setTo]=useState("");
  const load = useCallback(
    () =>
      api<{ users: AdminUser[] }>("/api/admin/users")
        .then((r) => setUsers(r.users))
        .catch((e) => setError(e.message)),
    [],
  );
  useEffect(() => {
    void load();
  }, [load]);
  async function adjust(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setError("");
    setMessage("");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api(`/api/admin/users/${selected.id}/wallet`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      setMessage(`${selected.name}'s wallet was updated.`);
      setSelected(null);
      e.currentTarget.reset();
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to update wallet.",
      );
    }
  }
  async function updateUser(user:AdminUser,action:"role"|"lock"){setError("");setMessage("");try{const body=action==="role"?{role:user.role==="admin"?"user":"admin"}:{locked:!Boolean(user.locked)};await api(`/api/admin/users/${user.id}/${action}`,{method:"PATCH",body:JSON.stringify(body)});setMessage(`${user.name} was updated.`);await load()}catch(reason){setError(reason instanceof Error?reason.message:"Unable to update user.")}}
  const shown=useMemo(()=>users.filter(u=>(!query||`${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()))&&(!role||u.role===role)&&(!access||(access==="locked")===Boolean(u.locked))&&(!from||u.created_at.slice(0,10)>=from)&&(!to||u.created_at.slice(0,10)<=to)),[users,query,role,access,from,to]);
  return (
    <>
      <div className="dash-heading">
        <div>
          <span className="dash-kicker">Customer management</span>
          <h1>Users</h1>
          <p>View accounts and credit or debit customer wallets.</p>
        </div>
      </div>
      {message && <div className="dash-alert success">{message}</div>}
      {error && <div className="dash-alert error">{error}</div>}
      <div className="admin-users-grid">
        <section className="dash-panel">
          <div className="table-toolbar admin-filters"><div className="dash-search">⌕ <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search users..."/></div><select value={role} onChange={e=>setRole(e.target.value)}><option value="">All roles</option><option value="user">Users</option><option value="admin">Admins</option></select><select value={access} onChange={e=>setAccess(e.target.value)}><option value="">All access</option><option value="active">Active</option><option value="locked">Locked</option></select><label>From<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label><label>To<input type="date" value={to} onChange={e=>setTo(e.target.value)}/></label></div>
          <div className="dash-table-wrap">
            <table className="dash-table admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Wallet</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                      <small>{u.email}</small>
                    </td>
                    <td><span className={`wallet-status ${u.locked?"wallet-status-failed":"wallet-status-completed"}`}>{u.locked?"Locked":"Active"}</span></td>
                    <td>{u.role}</td>
                    <td>
                      ₦
                      {Number(u.wallet_balance).toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="admin-action"
                        onClick={() => setSelected(u)}
                      >
                        Adjust wallet
                      </button>
                      <button className="admin-action" onClick={()=>void updateUser(u,"role")}>{u.role==="admin"?"Make user":"Make admin"}</button>
                      <button className="admin-action" onClick={()=>void updateUser(u,"lock")}>{u.locked?"Unlock":"Lock"}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {selected && (
          <form className="dash-panel admin-adjust" onSubmit={adjust}>
            <button
              type="button"
              className="admin-close"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <span className="dash-kicker">Wallet control</span>
            <h2>{selected.name}</h2>
            <p>{selected.email}</p>
            <div className="field">
              <label>Adjustment</label>
              <select name="type">
                <option value="credit">Credit wallet</option>
                <option value="debit">Debit wallet</option>
              </select>
            </div>
            <div className="field">
              <label>Amount</label>
              <input
                name="amount"
                type="number"
                min="1"
                step="0.01"
                required
                placeholder="5000"
              />
            </div>
            <div className="field">
              <label>Description</label>
              <input
                name="description"
                required
                placeholder="Reason for adjustment"
              />
            </div>
            <button className="button" type="submit">
              Update wallet
            </button>
          </form>
        )}
      </div>
    </>
  );
}
