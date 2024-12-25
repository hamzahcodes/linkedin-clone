import { Post } from "@/mongodb/models/post";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { postID: string }}) {
    try {
        const post = await Post.findById(params.postID)
        if(!post) {
            return NextResponse.json({ message: 'Post not found'}, { status: 404 });
        }
        return NextResponse.json({ post })
    } catch (error) {
        return NextResponse.json({ message: 'Error occured while fetching post'}, { status: 500 });
    }
}
