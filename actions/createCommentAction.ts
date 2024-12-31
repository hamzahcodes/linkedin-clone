'use server'
import connectToDB from "@/mongodb/db";
import { ICommentBase } from "@/mongodb/models/comment";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export default async function createCommentAction(formData: FormData, postId: string) {

    const user = await currentUser()
    const comment = formData.get('commentInput') as string;

    if(!postId) throw new Error('Post ID is required')
    if(!user?.id) throw new Error('User not authenticated')
    if(!comment) throw new Error('Comment is required')

    const userDB: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstName: user.firstName || "",
        lastName: user.lastName || ""
    }

    const commentBody: ICommentBase = {
        user: userDB,
        text: comment
    }

    await connectToDB()
    const post = await Post.findById(postId)

    if(!post) throw new Error('Post not found')
    try {
        await post.commentOnPost(commentBody)
    } catch (error) {
        console.log('Error while creating comment in createCommentAction')
    }
    revalidatePath('/')
}