import { Schema, model, models, Document, Model } from "mongoose";

export interface IFollowerBase {
    follower: string,
    following: string,
}

interface IFollowerMethods {
//     unfollow(): Promise<void>;
}

export interface IFollower extends IFollowerBase, IFollowerMethods, Document {
    createdAt: string,
    updatedAt: string,
}

interface IFollowerStatics {
    unfollow(): Promise<void>;
    follow(follower: string, following: string): Promise<IFollower>;
    getAllFollowers(userId: string): Promise<IFollower[]>;
    getAllFollowing(userId: string): Promise<IFollower[]>;
}

interface IFollowersModel extends Model<IFollower>, IFollowerStatics {}

const followerSchema = new Schema<IFollower>({
    follower: { type: String, required: true},
    following: { type: String, required: true}
}, { timestamps: true });

followerSchema.methods.unfollow = async function() {
    try {
        await this.deleteOne({ _id: this._id })
    } catch (error) {
        console.log("error when unfollowing", error);
    }
}

followerSchema.statics.follow = async function(follower: string, following: string) {
    try {
        const existingFollow = await this.findOne({ follower, following})
        if(existingFollow) {
            throw new Error('You are already following the user')
        }

        const follow = this.create({ follower, following })
        return follow
    } catch (error) {
        console.log("error when following", error);
    }
}

followerSchema.statics.getAllFollowers = async function (userId: string) {
    try {
        const followers = await this.findOne({ following: userId })
        return followers
    } catch (error) {
        console.log("error when getting all followers", error)
    }
}

followerSchema.statics.getAllFollowers = async function (userId: string) {
    try {
        const following = await this.findOne({ followers: userId })
        return following
    } catch (error) {
        console.log("error when getting all following", error)
    }
}

export const Followers = (models.Followers as IFollowersModel) || model<IFollower, IFollowersModel>("Followers", followerSchema);   