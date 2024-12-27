import connectToDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { postID: string }}) {
    try {
        const post = await Post.findById(params.postID)
        if(!post) {
            return NextResponse.json({ message: 'Post not found'}, { status: 404 });
        }
        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ message: 'Error occured while fetching post'}, { status: 500 });
    }
}

export async function DELETE(request: Request, { params } : { params: { postID: string }}) {
    const postId = params.postID;

    const { userId } = await auth()
    if(!userId) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 })
    }

    try {
        await connectToDB()
        const post = await Post.findById(postId)
        
        if(!post) {
            return NextResponse.json({ message: 'post not found'}, { status: 404 })
        }

        if(post.user.userId !== userId) {
            throw new Error('Post does not belong to the user')
        }

        await post.removePost()
    } catch (error) {
        return NextResponse.json({ message: 'Error occured while deleting post', error}, { status: 500 });
    }
}