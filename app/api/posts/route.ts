import connectToDB from "@/mongodb/db";
import { IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        await connectToDB()

        const posts = Post.getAllPosts()

        return NextResponse.json({ posts })
    } catch (error) {
        return NextResponse.json({ message: 'Error occured while fetching posts'}, { status: 500 });
    }
}

export interface AddPostRequestBody {
    user: IUser,
    text: string,
    imageUrl?: string | null,
}

export async function POST(request: Request) {
    const { userId } = await auth()

    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 })
    }


    try {
        await connectToDB()
        const { user, text, imageUrl } : AddPostRequestBody = await request.json();
        const postData: IPostBase = {
            user,
            text,
            ...(imageUrl && { imageUrl })
        }
        const post = await Post.create(postData)
        return NextResponse.json({ post })
    } catch (error) {
        return NextResponse.json({ message: 'Error occured while creating post'}, { status: 500 });
    }
    
}