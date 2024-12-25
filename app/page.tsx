import UserInformation from "@/components/UserInformation";
import PostForm from "@/components/PostForm";

export default function Home() {
  return (
    <div className="grid grid-cols-8 mt-5 sm:px-5">
      
      {/* User Information */}
      <section className="hidden md:inline md:col-span-2">
        <UserInformation />
      </section>

      {/* Post Feed and Post Form */}
      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">
        <PostForm />
      </section>

      {/* Widgets */}
      <section className="hidden xl:inline justify-center col-span-2">

      </section>
    </div>
  );
}
