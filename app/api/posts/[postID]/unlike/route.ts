import connectToDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params : { postID: string }}) {
    const { userId } = await auth()
    if(!userId) {
        return NextResponse.json({ message: 'Not authorized' }, { status: 401 })
    }

    try {
        await connectToDB()
        const post = await Post.findById(params.postID)
        if(!post) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 })
        }

        await post.unlikePost(userId)
        return NextResponse.json({ message: "Post unliked successfully" });
    } catch (error) {
        return NextResponse.json({ message: 'Error while creating unlike' }, { status: 500 })
    }
}