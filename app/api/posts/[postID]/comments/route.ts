import connectToDB from "@/mongodb/db";
import { ICommentBase } from "@/mongodb/models/comment";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { postID: string }}) {
    try {
        await connectToDB()
        
        const post = await Post.findById(params.postID)
        if(!post) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 })
        }

        const comments = await post.getAllComments()
        return NextResponse.json(comments)
    } catch (error) {
        return NextResponse.json({ message: 'Error while fetching comments' }, { status: 500 })
    }
}

export interface AddCommentRequestBody {
    user: IUser,
    text: string,
}

export async function POST(request: Request, { params } : {params: { postID: string }}) {
    try {
        const { user, text }: AddCommentRequestBody = await request.json()

        await connectToDB()

        const post = await Post.findById(params.postID)
        if(!post) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 })
        }

        const comment: ICommentBase = {
            user, text
        }
        await post.commentOnPost(comment)
        return NextResponse.json({ message: 'Comment added successfully' }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: 'Error while creating comment' }, { status: 500 })
    }
}