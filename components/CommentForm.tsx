'use client'

import { useUser } from "@clerk/nextjs"
import { useRef } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import createCommentAction from "@/actions/createCommentAction";
import { toast } from "sonner";

export default function CommentForm({ postId }: { postId : string }) {

    const { user } = useUser()
    const ref = useRef<HTMLFormElement>(null);

    async function handleCommentAction(formData: FormData): Promise<void> {
        const formDataCopy = formData;
        ref.current?.reset()
        const text = formDataCopy.get("commentInput") as string;

        if (!text) {
            throw new Error("You must provide a post input");
        }

        try {
            await createCommentAction(formDataCopy, postId)
        } catch (error) {
            console.log(error)
        }

    }

    return(
        <form 
            ref={ref} 
            action={(formData) => {
                const promise = handleCommentAction(formData)
                toast.promise(promise, {
                    loading: 'Creating comment...',
                    success: 'Comment created',
                    error: 'Failed to create comment'
                })
            }} 
            className="flex items-center space-x-1"
        >
            <Avatar>
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <input 
                // ref={inputRef}
                type="text"
                name="commentInput"
                placeholder="Add a Comment..."
                className="flex-1 py-2 px-3 outline-none border rounded-xl"
            />          

            <Button type="submit" variant={'secondary'} className="bg-gray-200 hover:bg-gray-300 rounded-xl py-2">Comment</Button>  
        </form>
    )
}