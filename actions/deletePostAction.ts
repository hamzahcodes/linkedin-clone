'use server'

import { Post } from "@/mongodb/models/post"
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export default async function deletePostAction(userId: string) {
    const user = await currentUser()

    if(!user) {
        throw new Error('Not authorized')
    }

    const post = await Post.findById(userId)
    if(!post) {
        throw new Error("Post not found")
    }

    if(post.user.userId !== user.id) {
        throw new Error("Post does not belong to the user")
    } 

    try {
        const imageUrl = post.imageUrl
        const client = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_KEY!
            }
        });
        const arr = imageUrl?.split('/')
        if(arr) {
            const putCommand = new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${arr[arr.length - 2]}/${arr[arr.length - 1]}`,
            })
            const response = await client.send(putCommand)
            console.log(response, 'deleted successfully')
        }
        await post.removePost()
        revalidatePath('/')
    } catch (error) {
        throw new Error('Error occured when deleting post')
    }
}