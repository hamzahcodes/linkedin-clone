import { IUser } from "@/types/user";
import { Document, models, Schema, model } from "mongoose";

export interface ICommentBase {
    user: IUser,
    text: string,
}

export interface IComment extends Document, ICommentBase {
    createdAt: string,
    updatedAt: string,
}

const commentSchema = new Schema<IComment>({
    user: {
        userId: { type: String, required: true},
        userImage: { type: String, required: true},
        firstName: { type: String, required: true},
        lastName: { type: String }
    },
    text: { type: String, required: true} 
}, { timestamps: true })

export const Comment = models.Comment || model<IComment>("Comment", commentSchema);