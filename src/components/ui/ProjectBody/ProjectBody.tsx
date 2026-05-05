"use client"
import React from 'react'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ProjectAction } from '@/actions/ProjectAction';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';


export interface ProjectsInterface {
    id: string;
    name: string;
    description: string;
    created_by: string;
    created_at: string;
}


export default function ProjectBody() {
    const { data, isLoading, error } = useQuery<ProjectsInterface[]>({
        queryKey: ["projects"],
        queryFn: ProjectAction,
    });


    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4">
            {data?.map((project) => (
                <Card key={project.id} className="mx-auto w-full max-w-sm  flex flex-col">
                    <Link href={'/projects/' + project.id}>
                        <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p>{project.description}</p>
                        </CardContent>

                        <CardFooter className='flex justify-between'>
                            <p>CREATED AT</p>
                            <span>
                                {new Date(project.created_at).toLocaleDateString()}
                            </span>
                        </CardFooter>
                    </Link>
                </Card>
            ))}
        </div>
    )
}
