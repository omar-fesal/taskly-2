import Link from 'next/link';
import ProjectHeader from '@/components/ui/ProjectHeader/ProjectHeader';
import { CreateProjectForm } from '@/components/ui/CreateProjectForm/CreateProjectForm';

export default function CreateProject() {
    return (
        <main>
            <div className="px-5 pt-5">
                <Link href={'/projects'} className='font-main font-bold text-[12px] text-[#43465499]'>
                    PROJECTS &gt;
                </Link>
                <span className='font-main font-bold text-[#003D9B] text-[12px]'>  ADD NEW PROJECT </span>
            </div>
            <ProjectHeader
                title='Add New Project'
                buttonText='Invite Member'
                icon='userPlus'
                action='invite'
            />
            <div className='flex justify-center items-center px-4'>
                <CreateProjectForm />
            </div>
        </main>
    )
}
