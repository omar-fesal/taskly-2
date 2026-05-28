"use client"

import Link from "next/link"
import Image from "next/image"

import { useState, useEffect } from "react"
import {
    LayoutDashboard,
    Folder,
    List,
    Users,
    Info,
    ChevronLeft,
    LogOut,
    Menu,
    X,
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
    const [mobileOpen, setMobileOpen] = useState(false)

    // Close mobile nav on route change or resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileOpen(false)
            }
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-white shadow-md"
                aria-label="Open navigation menu"
            >
                <Menu size={20} />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed md:relative z-50 h-screen bg-[#F7F8FC] border-r transition-all duration-300
                    ${collapsed ? "md:w-16" : "md:w-64"}
                    ${mobileOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                {/* Logo + close button */}
                <div className="flex items-center justify-between p-5">
                    <Image
                        src="/logo.png"
                        alt="Taskly Logo"
                        width={100}
                        height={80}
                    />

                    {/* Mobile close button */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="md:hidden p-1 rounded-md hover:bg-slate-100"
                        aria-label="Close navigation menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu */}
                <div className="flex flex-col gap-1 px-2 mt-4">
                    {menu.map((item, i) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={i}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
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
                        className="hidden md:flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 rounded"
                    >
                        <ChevronLeft size={16} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
                        {!collapsed && "Collapse"}
                    </button>

                    <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded">
                        <LogOut size={16} />
                        {!collapsed && "Logout"}
                    </button>
                </div>
            </div>
        </>
    )
}