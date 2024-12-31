import { Schema, Model, models, Document, model } from "mongoose";
import { IUser } from "@/types/user";
import { Comment, IComment, ICommentBase } from "./comment";

export interface IPostBase {
    user: IUser,
    text: string,
    imageUrl?: string,
    comments?: IComment[],
    likes?: string[]    
}

export interface IPost extends Document, IPostBase {
    createdAt: string,
    updatedAt: string,
}

// Define the document methods (for each instance of a post) 
interface IPostMethods {
    likePost(userId: string): Promise<void>;
    unlikePost(userId: string): Promise<void>;
    commentOnPost(comment: ICommentBase): Promise<void>;
    getAllComments(): Promise<IComment[]>;
    removePost(): Promise<void>;
}

interface IPostStatics {
    getAllPosts(): Promise<IPostDocument[]>
}

export interface IPostDocument extends IPost, IPostMethods {}
interface IPostModel extends IPostStatics, Model<IPostDocument> {}

const postSchema = new Schema<IPostDocument>({
    user: {
        userId: { type: String, required: true},
        userImage: { type: String, required: true},
        firstName: { type: String, required: true},
        lastName: { type: String }
    },
    text: { type: String, required: true},
    imageUrl: { type: String },
    comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: []},
    likes: { type: [String] }
}, { timestamps: true});

postSchema.methods.likePost = async function(userId: string) {
    try {
        await this.updateOne({ $addToSet: { likes: userId }})
    } catch (error) {
        console.log("error when liking post", error)
    }
}

postSchema.methods.unlikePost = async function(userId: string) {
    try {
        await this.updateOne({ $pull: { likes: userId }})
    } catch (error) {
        console.log("error when unliking post", error)
    }
}

postSchema.methods.removePost = async function() {
    try {
        await this.model('Post').deleteOne({ _id: this._id })
    } catch (error) {
        console.log("error when deleting post", error)
    }
}

postSchema.methods.commentOnPost = async function(commentToAdd: ICommentBase) {
    try {
        const newComment = await Comment.create(commentToAdd)
        this.comments.push(newComment)
        await this.save()
    } catch (error) {
        console.log("error when commenting on post", error)
    }
}

postSchema.methods.getAllComments = async function () {
    try {
        await this.populate({
            path: "comments",
            options: { sort: { createdAt: -1 }}
        })
        return this.comments
    } catch (error) {
        console.log("error when getting all comments", error)
    }
}

postSchema.statics.getAllPosts = async function() {
    try {
        const posts = await this.find({}).sort({ createdAt: -1 })
                        .populate({
                            path:"comments",
                            options: { sort: { createdAt: -1 }}
                        })
                        .populate("likes")
                        .lean()   // lean() to convert Mongoose objects to simple JS Objects
        
        return posts.map((post: IPostDocument) => ({
            ...post,
            // @ts-ignore
            _id: post._id.toString(),
            comments: posts.comments?.map((comment: IComment) => ({
                ...comment,
                // @ts-ignore
                _id: comment._id.toString()
            })),
        }))
    } catch (error) {
        console.log("error when getting all posts", error)
    }
}

export const Post = models.Post as IPostModel || model<IPostDocument, IPostModel>("Post", postSchema)