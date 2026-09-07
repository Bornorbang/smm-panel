import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata:Metadata={title:"Temporary USA Numbers",description:"Buy short-term USA numbers for SMS verification from SMM Panel Nigeria."};
export default function TempNumberLayout({children}:{children:React.ReactNode}){return <DashboardShell>{children}</DashboardShell>}
