import ProjectHeader from '@/components/ui/ProjectHeader/ProjectHeader';
import ProjectBody from '@/components/ui/ProjectBody/ProjectBody';

export default function Projects() {
    return (
        <main>
            <ProjectHeader
                title='Projects'
                description='Manage and curate your projects'
                buttonText='Create New Project'
                icon='plus'
                action='redirect'
                redirectTo='/createproject'
            />
            <ProjectBody />
        </main>
    )
}
