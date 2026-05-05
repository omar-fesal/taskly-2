// app/(dashboard)/layout.tsx


import DashboardHeader from "@/components/ui/DashBoardHeader/DashBoardHeader"
import { SideNav } from "@/components/ui/SideNav/SidNav"



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-[#F7F8FC]">
            <SideNav />

            <div className="flex flex-1 flex-col">
                <DashboardHeader />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}