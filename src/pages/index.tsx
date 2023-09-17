import Head from "next/head";
import Link from "next/link";
import { SignInButton, UserButton, useUser} from "@clerk/nextjs";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { isLoaded, isSignedIn, user } = useUser();

  // In case the user signs out while on the page.
  if (!isLoaded || !isSignedIn) {
    return (
      <SignInButton/>
    )

  }

  return (
    <>
    Hello, {user.firstName}
      <div>
        <UserButton afterSignOutUrl="/" />
      </div>
      <p className="text-2xl text-black">
        {hello.data ? hello.data.greeting : "Loading tRPC query..."}
      </p>
    </>
  );
}
