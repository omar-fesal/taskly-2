"use client"

import Link from "next/link"
import Image from "next/image"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
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
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import LogoutAction from "@/actions/LogutAction"
import { AuthService } from "@/lib/AuthService"
import toast from "react-hot-toast"

function useProjectId() {
    const pathname = usePathname()
    const match = pathname?.match(/^\/(?:projects|createepic|editproject)\/([^/]+)/)
    return match ? match[1] : null
}


function buildMenu(projectId: string | null) {
    const base = projectId ? `/projects/${projectId}` : null
    return [
        { label: "Projects", icon: Folder, href: "/projects" },
        { label: "Project Epics", icon: LayoutDashboard, href: base ?? "/projects" },
        { label: "Project Tasks", icon: List, href: base ? `${base}/tasks` : "/projects" },

    ]
}

export function SideNav() {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const projectId = useProjectId()
    const menu = buildMenu(projectId)
    const pathname = usePathname()
    const router = useRouter()
    const logoutMutation = useMutation({
        mutationFn: LogoutAction,

        onSuccess: () => {
            toast.success("Logged out successfully")


            AuthService.clearSession()

            router.push("/login")
        },

        onError: () => {
            toast.error("Logout failed")
        },
    })
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

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

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
                    fixed md:sticky md:top-0 left-0 z-50 h-screen md:h-screen bg-[#F7F8FC] border-r transition-all duration-300 shrink-0
                    ${collapsed ? "md:w-16" : "md:w-64"}
                    ${mobileOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                {/* Logo + close button */}
                <div className="flex items-center justify-between p-5">
                    <Image
                        src="/Logo.png"
                        alt="Taskly Logo"
                        width={100}
                        height={80}
                        style={{ height: "auto" }}
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
                        const isActive = (() => {
                            if (item.label === "Projects") {
                                return (
                                    pathname === "/projects" ||
                                    pathname.startsWith("/projects/") ||
                                    pathname.startsWith("/createproject") ||
                                    pathname.startsWith("/editproject") ||
                                    pathname.startsWith("/createepic") ||
                                    pathname.startsWith("/createtask") ||
                                    pathname.startsWith("/editepics")
                                )
                            }
                            if (item.label === "Project Epics") {
                                return (
                                    !!projectId &&
                                    (pathname === `/projects/${projectId}` ||
                                        pathname.startsWith(`/createepic/${projectId}`) ||
                                        pathname.startsWith("/editepics/"))
                                )
                            }
                            if (item.label === "Project Tasks") {
                                return (
                                    !!projectId &&
                                    (pathname === `/projects/${projectId}/tasks` ||
                                        pathname.startsWith("/createtask"))
                                )
                            }
                            return pathname === item.href
                        })()

                        return (
                            <Link
                                key={i}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                                    ${isActive
                                        ? "bg-white text-[#003D9B] font-semibold shadow-sm"
                                        : "text-[#041B3C] hover:bg-white hover:text-[#003D9B]"
                                    }`}
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

                    <button
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
                    >
                        <LogOut size={16} />
                        {logoutMutation.isPending ? "Logging out..." : (!collapsed && "Logout")}
                    </button>
                </div>
            </div>
        </>
    )
}
