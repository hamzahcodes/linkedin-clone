'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs"
import { Button } from "./ui/button"
import { IPostDocument } from "@/mongodb/models/post"
import { useEffect, useState } from "react"

function UserInformation({ posts }: { posts: IPostDocument[] }) {
    const { user } = useUser()

    const [ numberOfPosts, setNumberOfPosts ] = useState<number>(0);
    const [ numberOfComments, setNumberOfComments ] = useState<number>(0);
    const firstName = user?.firstName
    const lastName = user?.lastName
    const imageUrl = user?.imageUrl

    useEffect(() => {
        setNumberOfPosts(posts.filter(post => post.user.userId === user?.id).length)
        const userComments = posts.flatMap((post) =>
            post?.comments?.filter((comment) => comment.user.userId === user?.id) || []
        );
        setNumberOfComments(userComments.length)
    }, [posts, user?.id])

    return (
        <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-xl border py-4">
            <Avatar>
                {user?.id ? (
                    <AvatarImage src={imageUrl} />
                ) : (
                    <AvatarImage src="https://github.com/shadcn.png" />
                )}
                <AvatarFallback>
                    {firstName?.charAt(0)}
                    {lastName?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <SignedIn>
                <div className="text-center">
                    <p className="font-semibold">
                        {firstName} {lastName}
                    </p>

                    <p className="text-xs">
                        @{firstName} {lastName}-{user?.id?.slice(-4)}
                    </p>
                </div>
            </SignedIn>


            <SignedOut>
                <div className="space-y-2 text-center">
                    <p className="font-semibold">You are not signed in</p>

                    <Button asChild className="bg-[#0B63C4] text-white">
                        <SignInButton>Sign in</SignInButton>
                    </Button>
                </div>  
            </SignedOut>

            
            <SignedIn>
                <hr className="w-full border-gray-200 my-5"/>

                <div className="flex justify-between w-full px-4 text-sm">
                    <p className="font-semibold text-gray-400">Posts</p>
                    <p className="text-blue-400">{numberOfPosts}</p>
                </div>

                <div className="flex justify-between w-full px-4 text-sm">
                    <p className="font-semibold text-gray-400">Comments</p>
                    <p className="text-blue-400">{numberOfComments}</p>
                </div>
            </SignedIn>
            
        </div>
    )
}

export default UserInformation