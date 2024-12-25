'use server'

import { AddPostRequestBody } from "@/app/api/posts/route";
import { IPost, IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server"

export default async function createPostAction(formData:FormData) {
    const user = await currentUser()

    if(!user) {
        throw new Error('Not authenticated')
    }
    const postInput = formData.get('postInput') as string;
    const image = formData.get('image') as File;
    let imageUrl : string | undefined;

    if(!postInput) {
        throw new Error('provide a post text')
    }

    // define user
    const userDB: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstName: user.firstName || "",
        lastName: user.lastName || ""
    }

    // upload image if there is any
    // create post in database

    try {
        if(image.size > 0) {
            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput,
                // imageUrl: image_url
            }
            await Post.create(body)
        } else {
            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput
            }
            await Post.create(body)
        }
    } catch (error: any) {
        throw new Error("post not created due to error", error)
    }

    // revalidate path('/')
}