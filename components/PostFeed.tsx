import { IPost, IPostDocument } from "@/mongodb/models/post";
import Post from "./Post";
import { Key } from "react";

function PostFeed({ posts } : { posts : IPostDocument[] }) {
    return <div className="space-y-2 pb-20">
        {posts.map(post => (
            <Post key={post?._id as Key} post={post} />
        ))}
    </div>
}

export default PostFeed;