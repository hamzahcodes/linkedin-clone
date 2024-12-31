'use client'

import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import TimeAgo from 'react-timeago'
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import deletePostAction from "@/actions/deletePostAction";
import Image from "next/image";
import PostOptions from "./PostOptions";


function Post({ post }: { post: IPostDocument}) {
    const { user } = useUser()

    const isAuthor = user?.id === post.user.userId
    return (
        // the whole post
        <div className="bg-white rounded-xl border">

            {/* the header area containing avatar, name, username, time ago and delete icon */}
            <div className="p-4 flex space-x-2">
                {/* User Avatar */}
                <div>
                    <Avatar>
                        <AvatarImage src={post.user?.userImage} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>

                {/* User name, username, timeago */}
                <div className="flex justify-between flex-1">
                    <div>
                        <p className="font-semibold">{post.user?.firstName} {post.user?.lastName} {" "} {isAuthor && (
                            <Badge className="ml-2 bg-gray-200 rounded-xl hover:bg-gray-200 cursor-pointer" variant="secondary">Author</Badge>
                        )}
                        </p>
                        <p className="text-xs text-gray-400">@{post.user.firstName} {post.user?.lastName}-{post.user?.userId.slice(-4)}</p>
                        <p className="text-xs text-gray-400">
                            <TimeAgo date={post.createdAt}/>
                        </p>
                    </div>

                    {isAuthor && (
                        <Button onClick={() => deletePostAction(post._id as string)}>
                            <Trash2 />
                        </Button>
                    )}


                </div>
            </div>

            {/* actual text and image of post */}

            <div>
                <p className="px-4 pb-2 mt-2">{post.text}</p>

                {post.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="w-full mx-auto h-80 object-cover" width={60} height={30} src={post.imageUrl} alt="Post image"/>
                )}
            </div>
            
            {/* post options include like, comment and share */}
            <PostOptions postId={post._id as string} post={post} />
        </div>
    )
}

export default Post