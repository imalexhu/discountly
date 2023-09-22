import { SignInButton, UserButton, useUser} from "@clerk/nextjs";
import { NewUserLandingPage } from "~/components/NewUserLandingPage"
import { SearchPage } from "~/pages/search/index"
export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

    
  // In case the user signs out while on the page.
  // if (!isLoaded) {
  //   return (
  //     <Spinner/>
  //   )
  // }

  if (!isSignedIn){
    return <NewUserLandingPage/>
  }

  return ( 
    <SearchPage />
  )
}
