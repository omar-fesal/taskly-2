// components/organisms/dashboard/header.tsx
'use client'
import Image from "next/image"
import AxiosInstance from "@/lib/AxiosBase";
import GetUserData from "@/actions/GetUserData";
import { useQuery } from "@tanstack/react-query";






export interface User {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata?: AppMetadata;
    user_metadata?: UserMetadata;
    raw_app_meta_data?: AppMetadata;
    raw_user_meta_data?: UserMetadata;
    identities: Identity[];
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
}

export interface AppMetadata {
    provider: string;
    providers: string[];
}

export interface UserMetadata {
    department: string;
    email: string;
    email_verified: boolean;
    name: string;
    phone_verified: boolean;
    sub: string;
}

export interface Identity {
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: IdentityData;
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
}

export interface IdentityData {
    department: string;
    email: string;
    email_verified: boolean;
    name: string;
    phone_verified: boolean;
    sub: string;
}




export default function DashboardHeader() {

     const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: GetUserData,
  });
    
    // Supabase raw API returns raw_user_meta_data, while supabase-js returns user_metadata
    const metadata = user?.user_metadata || user?.raw_user_meta_data;

    return (
        <header className="flex h-16 w-full items-center justify-end border-b bg-[#F7F8FC] px-6">

            <div className="flex items-center gap-3">
                <div className="text-right">

                    <p className="text-[14px] font-semibold uppercase text-[#041B3C]">
                        {isLoading ? "Loading..." : metadata?.name || "User"}
                    </p>

                    <p className="text-[10px] font-bold uppercase text-[#003D9B]">
                        {metadata?.department || ""}
                    </p>

                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0B5ED7] text-white">
                    {metadata?.name?.slice(0,2)?.toUpperCase() || "MT"}
                </div>

            </div>
        </header>
    );
}