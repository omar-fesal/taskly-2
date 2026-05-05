
import React from 'react'
import Link from 'next/link';
import ProjectHeader from '@/components/ui/ProjectHeader/ProjectHeader';
import { UserPlus } from "lucide-react";
import { CreateProjectForm } from '@/components/ui/CreateProjectForm/CreateProjectForm';
export default function CreateProject() {
    return <main>
        <div>
            <Link href={'/projects'} className='font-main font-bold text-[12px] text-[#43465499]'>
                PROJECTS &gt;
            </Link>
            <span className='font-main font-bold text-[#003D9B] text-[12px]'>  ADD NEW PROJECT </span>
        </div>
        <ProjectHeader title='Add New Project' buttonText='Invite Member' icon='userPlus' />
        <div className=' flex justify-center items-center'>

            <CreateProjectForm />
        </div>

    </main>
}
