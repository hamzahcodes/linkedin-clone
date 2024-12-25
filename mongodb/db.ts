import mongoose from "mongoose"

const connectionString = process.env.MONGO_URI

if(!connectionString) {
    throw new Error('Please define a connection string in .env file')
}

export default async function connectToDB() {
    if(mongoose.connection?.readyState === 1) {
        console.log('Already connected to MONGO DB')
        return 
    } 

    try {
        await mongoose.connect(connectionString!)
        console.log('New MONGO DB connection made')
    } catch (error) {
        console.log(error)
    }
}


