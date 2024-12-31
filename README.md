# Linkedin Clone

This project might just be a Clone, but my focus is to get implementation understanding of such systems.
Let's breakdown the project.

## Tech Stack

- **Client:** NextJS 14, TypeScript, ShadCN, TailwindCSS 
- **Server:** Server Actions, Clerk for Auth, API routes
- **Database:** MongoDB using Mongoose, AWS S3 to store images


## Frontend

This is a single page application. It has 3 components:
- UserInformation - contains basic email, image and username of user with no. of posts and comments
- Post
    - This consists of Post Form and Post Feed
- Widget - To know details of Followers and Following


## Backend

I divided the backend in 2 parts, Some parts I used server actions and for others I used API route:
- Server actions - I used this whenever I created a post or comment. This helped directly track the inputs and create the same on server.
- API route - For actions including liking post, getting comment counts, post counts, etc. This was much cleaner and logical.


## Cloud Storage
- Mongo DB 
    - 3 models created .i.e Post, Comment, Follower. You can check the details in models folder under mongodb directory.
- AWS S3 to store the images on creation of post. Also deleted the image from S3 when post gets deleted.


## Contribute
- You can fork / clone this repo and setup on your system. 
- Steps
    - Simply paste the the link found under Code button inside a new directory in your system. 
    - ```MONGO_URI, AWS_REGION, AWS_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_KEY```
    - Since, I have used Clerk for Authentication, it will automatically create 2 more env variables viz. ```NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY ```
    - Run ```npm install``` or any other package manager tool to install all dependencies.
    - Run the project ```npm run dev```.
- You can create a pull request to my repository if you feel some features can be added or modified.