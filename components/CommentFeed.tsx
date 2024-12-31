'use client'

import { IPostDocument } from "@/mongodb/models/post";
import { Key } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import ReactTimeago from "react-timeago";
import { Badge } from "./ui/badge";
import { useUser } from "@clerk/nextjs";
import { IComment } from "@/mongodb/models/comment";

export default function CommentFeed({ comments, postId }: { comments: IComment[], postId: string }) {
    const { user } = useUser()
    console.log(comments)
    const isAuthor = user?.id === postId;

    return (
        <div className="space-y-2 mt-3">
            {comments.map(comment => (
                <div key={comment._id as Key} className="flex space-x-1">
                    <Avatar>
                        <AvatarImage src={comment.user.userImage} />
                        <AvatarFallback>
                            {comment.user.firstName.charAt(0)}
                            {comment.user.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-semibold">
                                    {comment.user.firstName} {comment.user?.lastName} {isAuthor && (
                                        <Badge className="ml-2 bg-gray-200 rounded-xl hover:bg-gray-200 cursor-pointer" variant="secondary">Author</Badge>
                                    )}
                                </p>
                                <p className="text-xs text-gray-400">
                                    @{comment.user.firstName} {comment.user?.lastName}-{comment.user.userId.toString().slice(-4)}
                                </p>
                            </div>

                            <p className="text-xs text-gray-400">
                                <ReactTimeago date={new Date(comment.createdAt)} />
                            </p>
                        </div>

                        <p className="mt-3 text-sm">{comment.text}</p>
                    </div>
                </div> 
            ))}
        </div>
    )
}