import { SignInButton, UserButton, useUser} from "@clerk/nextjs";
import { NewUserLandingPage } from "~/components/NewUserLandingPage"
import { SearchPage } from "~/pages/search/index"
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingState } from "~/components/LoadingState";
export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter()
    

  useEffect(() => {
    if (user) {
      router.push("/search").catch((e)=>console.log(e))
    }
  }, [user]);

  // In case the user signs out while on the page.
  if (!isLoaded) {
    return (
      <LoadingState/>
    )
  }

  if (!isSignedIn){
    return <NewUserLandingPage/>
  }


  
  
}
