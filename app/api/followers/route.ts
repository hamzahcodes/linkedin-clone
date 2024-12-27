import connectToDB from "@/mongodb/db"
import { Followers } from "@/mongodb/models/follower"
import { NextResponse } from "next/server"

// GET function is used to get all followers of a user
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    try {
        await connectToDB()

        if(!user_id) {
            return NextResponse.json({ message: 'User ID not provided'}, { status: 400 })
        }

        const followers = await Followers.getAllFollowers(user_id)
        if(!followers) {
            return NextResponse.json({ message: 'User ID not found'}, { status: 404 })
        }

        return NextResponse.json(followers)
    } catch (error) {
        return NextResponse.json({ message: 'Error while fetching followers'}, { status: 500 })
    }
}

export interface FollowerRequestBody {
    followerUserId: string,
    followingUserId: string
}

export async function POST(request: Request) {
    const { followerUserId, followingUserId }: FollowerRequestBody = await request.json()

    try {
        await connectToDB()

        const follow = Followers.create({ follower: followerUserId, following: followingUserId })

        if(!follow) {
            return NextResponse.json({ message: 'Failed to create'}, { status: 400 })
        }
        return NextResponse.json({ message: 'Follower created successfully'}, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: 'Error while creating followership'}, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const { followerUserId, followingUserId }: FollowerRequestBody = await request.json()

    try {
        await connectToDB()

        if(!followerUserId || !followingUserId) {
            return NextResponse.json({ message: 'Follower and Following userid not found'}, { status: 404 })
        }

        const follow = Followers.findOne({ follower: followerUserId, following: followingUserId })

        if(!follow) {
            return NextResponse.json({ message: 'No such followership present'}, { status: 404 })
        }

        await follow.deleteOne({ follower: followerUserId, following: followingUserId})
        return NextResponse.json({ message: "Unfollowed successfully" });
    } catch (error) {
        return NextResponse.json({ message: 'Error while creating followership'}, { status: 500 })
    }
}