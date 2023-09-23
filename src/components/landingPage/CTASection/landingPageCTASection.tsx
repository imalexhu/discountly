import { SignInButton, Signin } from "@clerk/nextjs"
import { useRouter } from "next/router"

export function LandingPageCTASection(): React.JSX.Element {

  const router = useRouter();

  return (
    <>
      <div className=" mx-auto w-full h-36 container flex ustify-center">
        <div className=" h-24 w-2/3 flex flex-col justify-center items-center">
          <h1 className=" h-12 text-8xl text-green-600">{'"'}</h1>
          <span className="text-2xl text-black">
            Could be shopping smarter?
          </span>
          <button onClick={() => { window.location.href = '/sign-in' }} type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Join Discountly Now</button>
        </div>

        <div className="flex-grow">right
          <img src="" alt="Money bag" />
        </div>
      </div>
    </>
  )
}
