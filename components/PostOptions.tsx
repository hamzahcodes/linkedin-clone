'use client'

import { IPostDocument } from "@/mongodb/models/post"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function PostOptions({ postId, post }: { postId: string, post: IPostDocument}) {

    const { user } = useUser()
    const [ isCommentOpen, setIsCommentOpen ] = useState(false)
    const [ likes, setLikes ] = useState(post.likes)
    const [ liked, setLiked ] = useState(false)

    useEffect(() => {
        if(user?.id && post.likes?.includes(user?.id)) {
            setLiked(true)
        }
    }, [post, user])

    async function likeOrUnlikePost() {
        if (!user?.id) {
            throw new Error("User not authenticated");
        }
      
        const originalLiked = liked;
        const originalLikes = likes;
        
        const newLikes = liked ? likes?.filter((like) => like !== user.id) : [...(likes ?? []), user.id];
      
        const body = { userId: user.id };
      
        setLiked(!liked);
        setLikes(newLikes);
      
        const response = await fetch(`/api/posts/${postId}/${liked ? "unlike" : "like"}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...body }),
        });
      
        if (!response.ok) {
            setLiked(originalLiked);
            throw new Error("Failed to like post");
        }
    
        const fetchLikesResponse = await fetch(`/api/posts/${postId}/like`);
        if (!fetchLikesResponse.ok) {
            setLikes(originalLikes);
            throw new Error("Failed to fetch likes");
        }
    
        const newLikesData = await fetchLikesResponse.json();
        setLikes(newLikesData);
    };
    return (
        <div>

            {/* for no.of likes and no.of comments */}
            <div className="flex justify-between p-4">
                <div>
                    {likes && likes.length > 0 && (
                        <p className="text-xs text-gray-600 cursor-pointer hover:underline">{likes.length} likes</p>
                    )}
                </div>

                <div>
                    {post?.comments && post.comments.length > 0 && (
                        <p
                            onClick={() => setIsCommentOpen(!isCommentOpen)}
                            className="text-xs text-gray-600 cursor-pointer hover:underline"
                        >{post.comments.length} comments</p>
                    )}
                </div>
            </div>

            {/* for like, comment, repost, and share buttons */}
            <div className="flex p-2 justify-between px-2 border-t">
                
                {/* like button */}

                <Button
                    variant="ghost"
                    className="postButton"
                    onClick={likeOrUnlikePost}
                >
                    <ThumbsUpIcon className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")} />Like
                </Button>

                <Button
                    variant="ghost"
                    className="postButton"
                    onClick={() => setIsCommentOpen(!isCommentOpen)}
                >
                    <MessageCircle className={cn("mr-1", isCommentOpen && "text-gray-600 fill-gray-600")} />
                    Comment
                </Button>

                <Button variant="ghost" className="postButton">
                    <Repeat2 className="mr-1" /> Repost
                </Button>

                <Button variant="ghost" className="postButton">
                    <Send className="mr-1" /> Send
                </Button>
            </div>
        </div>
    )
}

export default PostOptions