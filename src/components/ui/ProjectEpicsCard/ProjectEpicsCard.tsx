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
import { UserPen } from 'lucide-react'
export default function ProjectEpicsCard() {
    return <>
        <div className='grid grid-cols-1 md:grid-cols-2   gap-4"'>

            <Card size="sm" className="mx-auto w-xl max-w-xl  border-l-4 border-[#004E32]">
                <CardHeader>
                    <div>
                        <CardTitle className='py-1 px-2.5 bg-[#82F9BE] w-fit font-main font-bold text-[10px] text-[#005235]' ><p>EPIC-102</p></CardTitle>

                    </div>

                </CardHeader>
                <CardContent className='border-b pb-6'>
                    <h2 className='font-main font-semibold text-[20px]'>Sustainable Materials Integration</h2>
                    <div className='flex gap-1'>
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#65DCA4] text-[11px] font-bold text-[#002113] mt-1">
                            <span>OM</span>
                        </div>

                        <div className="">
                            <span className='font-main text-[12px] font-medium text-[#434654]' >Assignee</span>
                            <p className='font-main font-semibold text-[14px]  text-[#041B3C]'>Alice Moore</p>
                        </div>

                    </div>
                </CardContent>
                <CardFooter>
                    <UserPen className='w-3 mr-1' />
                    <p className='font-main text-[11px] text[#434654CC]'> Created by:
                        <span className='font-main font-semibold text-[#041B3C]'>omar fesal</span>
                    </p>
                </CardFooter>
            </Card>
        </div>

    </>
}
