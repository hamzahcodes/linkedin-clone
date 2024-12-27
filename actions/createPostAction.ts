'use server'

import { AddPostRequestBody } from "@/app/api/posts/route";
import { IPost, IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server"
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function createPostAction(formData:FormData) {
    const user = await currentUser()
    console.log(user, 'line 10')
    if(!user) {
        throw new Error('Not authenticated')
    }
    const postInput = formData.get('postInput') as string;
    const image = formData.get('image') as File;
    let imageUrl : string | undefined;

    console.log(image)
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
        const client = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_KEY!
            }
        });

        if(image.size > 0) {
            const filetype = image.type.split('/')[1]
            const imageBuffer = await image.arrayBuffer()
            const imageName = `images/pic_${Date.now().toString()}.${filetype}`
            try {
                const putCommand = new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: imageName,
                    Body: imageBuffer as unknown as Buffer
                })
                const response = await client.send(putCommand)

                const getSignedURLCommand = new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: imageName
                })
                const url = getSignedUrl(client, getSignedURLCommand)
                console.log(url)
            } catch (error) {
                console.log(error)
            }
            return
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