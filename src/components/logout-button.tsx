"use client";
import { useRouter } from "next/navigation";

const api = process.env.NEXT_PUBLIC_API_URL || "/backend-api";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch(`${api}/api/auth/logout`, { method: "POST", credentials: "include" });
    router.push("/");
  }
  return <button onClick={logout} className="button button-secondary">Log out</button>;
}
