"use client"

import Link from "next/link"
import Image from "next/image"

import { useState } from "react"
import {
    LayoutDashboard,
    Folder,
    List,
    Users,
    Info,
    ChevronLeft,
    LogOut,
} from "lucide-react"

const menu = [
    { label: "Projects", icon: Folder, href: "/projects" },
    { label: "Project Epics", icon: LayoutDashboard, href: "/projectepics" },
    { label: "Project Tasks", icon: List, href: "/projecttasks" },
    { label: "Project Members", icon: Users, href: "/projectmembers" },
    { label: "Project Details", icon: Info, href: "/projectdetails" },
]

export function SideNav() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div
            className={`h-screen bg-[#F7F8FC] border-r transition-all duration-300 ${collapsed ? "w-16" : "w-64"
                }`}
        >
            {/* Logo */}
            <div className="container mx-auto flex items-center justify-between p-5">

                <Image
                    src="/logo.png"
                    alt="Taskly Logo"
                    width={100}
                    height={80}
                />



            </div>

            {/* Menu */}
            <div className="flex flex-col gap-1 px-2 mt-4">
                {menu.map((item, i) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={i}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-[#041B3C] hover:bg-white text-sm hover:text-[#003D9B]"
                        >
                            <Icon size={18} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom */}
            <div className="absolute bottom-0 w-full p-2">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 rounded"
                >
                    <ChevronLeft size={16} />
                    {!collapsed && "Collapse"}
                </button>

                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded">
                    <LogOut size={16} />
                    {!collapsed && "Logout"}
                </button>
            </div>
        </div>
    )
}