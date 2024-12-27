'use client'

import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useUser } from '@clerk/nextjs'
import { Button } from "./ui/button";
import { FileInput, ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";
import createPostAction from "@/actions/createPostAction";

function PostForm() {
    const { user, isSignedIn } = useUser()
    const ref = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [ preview, setPreview ] = useState<string | null>(null);


    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    async function handlePostAction(formData: FormData) {
        const formDataCopy = formData
        ref.current?.reset()

        const text = formDataCopy.get('postInput') as string;

        if(!text.trim()) {
            throw new Error('You must provide an input')
        }
        setPreview(null)
        // console.log(inputRef, 'line 35')
        try {
            await createPostAction(formDataCopy)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="mb-2">
            <form ref={ref} className="p-2 bg-white rounded-lg border" action={formData => {
                handlePostAction(formData)
            }}>
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0)}
                            {user?.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <input
                        type="text" 
                        name="postInput" 
                        placeholder="Start writing a post..."
                        className="flex-1 outline-none rounded py-3 px-4 border"
                    />

                    <input 
                        ref={inputRef} 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        hidden
                        onChange={handleImageChange}
                    />

                    <button type="submit">Post</button>
                </div>

                {/* Preview when image selected */}
                {preview && (
                    <div className="mt-3">
                        <Image src={preview} alt="Preview image" className="w-full rounded-lg object-cover" width={60} height={60}/>
                    </div>
                )}


                <div className="flex justify-end space-x-2 mt-2">
                    <Button 
                        type="button" 
                        onClick={() => inputRef.current?.click()}    
                    >
                        <ImageIcon className="mr-2" size={16} color="currentColor" /> 
                        {preview ? "Change" : "Add"} image
                    </Button>

                    {preview && (
                        <Button variant='outline' type="button" onClick={() => setPreview(null)}>
                            <XIcon className="mr-2" size={16} color="currentColor" /> Remove Image
                        </Button>
                    )}
                </div>
            </form>

            <hr className="mt-2 border-gray-300"/>
        </div>
    )
}

export default PostForm