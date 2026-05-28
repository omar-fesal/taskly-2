import Link from 'next/link';
import ProjectHeader from '@/components/ui/ProjectHeader/ProjectHeader';
import { EditProjectForm } from '@/components/ui/EditProjectForm/EditProjectForm';
import { Params } from 'next/dist/server/request/params';

export default async function EditProject({ params }: { params: Params }) {
    const { projectid } = await params;

    return (
        <main>
            <div>
                <Link href={'/projects'} className='font-main font-bold text-[12px] text-[#43465499]'>
                    PROJECTS &gt;
                </Link>
                <span className='font-main font-bold text-[#003D9B] text-[12px]'>  EDIT PROJECT </span>
            </div>
            <ProjectHeader title='Edit Project' buttonText='Invite Member' action='dialog' icon='userPlus' />
            <div className='flex justify-center items-center'>
                <EditProjectForm projectId={projectid as string} />
            </div>
        </main>
    );
}
