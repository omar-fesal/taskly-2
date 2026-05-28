'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Mail, UserPlus, Loader2 } from 'lucide-react'

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"

import toast from "react-hot-toast"

import InviteMemberAction from "@/actions/InviteMemberAction"

const formSchema = z.object({
    email: z.email("Please enter a valid email")
})



export default function InviteMemberForm() {
    const [open, setOpen] = React.useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    })

    const InviteMutation = useMutation({
        mutationFn: InviteMemberAction,

        // onSuccess: () => {
        //     toast.success("Invitation sent successfully")

        //     form.reset()
        // },

        // onError: (error: any) => {
        //     toast.error(
        //         error?.response?.data?.message ||
        //         "Something went wrong"
        //     )
        // }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        toast.success('Invitation sent successfully')
        form.reset()

        setOpen(false)

    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-fit h-12 rounded-sm bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC]"
                >
                    <UserPlus className="mr-2 w-4 h-4" />
                    Invite Member
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">

                <form onSubmit={form.handleSubmit(onSubmit)}>

                    <DialogHeader>
                        <div className='bg-[#F1F3FF] w-fit p-2 rounded-md'>
                            <UserPlus className='text-[#003D9B]' />
                        </div>

                        <DialogTitle className='font-main font-bold text-2xl'>
                            Invite Team Member
                        </DialogTitle>

                        <DialogDescription className='font-main text-[14px] text-[#4F5F7B]'>
                            Send an invitation to join the workspace.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="mt-5">

                        <Field>
                            <Label
                                className="font-main font-bold text-[11px] text-[#4F5F7B]"
                                htmlFor="email"
                            >
                                Email Address
                            </Label>

                            <div className="relative">

                                <Input
                                    className="font-main text-[14px] text-[#73768599] pr-10"
                                    id="email"
                                    placeholder="Email Address"
                                    {...form.register("email")}
                                />

                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>

                            {form.formState.errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </Field>

                    </FieldGroup>

                    <DialogFooter className='flex justify-center items-center mt-5'>

                        <DialogClose asChild>
                            <Button
                                type="button"
                                className="flex-1 h-12 rounded-sm bg-white text-[#4F5F7B] font-main font-semibold hover:bg-white"
                            >
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={InviteMutation.isPending}
                            className="flex-1 h-12 rounded-sm bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC]"
                        >
                            {InviteMutation.isPending ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                                "Send Invitation"
                            )}
                        </Button>

                    </DialogFooter>

                </form>

            </DialogContent>
        </Dialog>
    )
}
