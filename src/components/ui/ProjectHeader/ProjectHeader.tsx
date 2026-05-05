'use client'
import React from 'react'
import { Button } from '../button'
import { LucideIcon, Plus, UserPlus } from 'lucide-react'
import { useRouter } from "next/navigation";

interface ProjectHeaderProps {
    title: string;
    description?: string;
    buttonText?: string;
    redirectTo?: string;
    icon?: "userPlus" | "plus";
}

export default function ProjectHeader({
    icon,
    title,
    description,
    buttonText = "Create New Project",
    redirectTo = "/createproject"
}: ProjectHeaderProps) {


    const icons = {
        userPlus: UserPlus,
        plus: Plus
    };


    const router = useRouter();
    const Icon = icons[icon ?? "plus"];


    return (
        <div className='flex justify-between p-5'>
            <div className='flex flex-col'>
                <h2 className='font-main font-semibold text-[30px] text-[#041B3C]'>
                    {title}
                </h2>

                {description && (
                    <p className='font-main text-[16px] text-[#434654]'>
                        {description}
                    </p>
                )}
            </div>

            <div>
                <Button
                    onClick={() => router.push(redirectTo)}
                    className="w-full h-12 rounded-sm bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC]"
                >
                    <Icon />{buttonText}
                </Button>
            </div>
        </div>
    )
}