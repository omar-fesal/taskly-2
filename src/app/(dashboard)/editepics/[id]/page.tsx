"use client"
import EditEpicsForm from '@/components/ui/EditEpicsForm/EditEpicsForm';
import ProjectHeader from '@/components/ui/ProjectHeader/ProjectHeader';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React from 'react'

export default function EditEpics() {
    const { id } = useParams();
    return <>
        <div>
            <Link href={'/projects'} className='font-main font-bold text-[12px] text-[#43465499]'>
                PROJECTS &gt;
            </Link>
            <span className='font-main font-bold text-[#003D9B] text-[12px]'>  EDIT PROJECT </span>
        </div>
        <ProjectHeader title='Edit Project' buttonText='Invite Member' action='dialog' icon='userPlus' />
        <div className='flex justify-center items-center'>
            <EditEpicsForm epicId={id as string} />
        </div>

    </>
}
