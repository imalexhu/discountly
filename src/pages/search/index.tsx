import { Footer } from "~/components/footer/footer";
import { DisplayContent } from "~/components/searchPage/DisplaySearchResults";
import { SearchBar } from "~/components/searchPage/searchBar";
export default function SearchPage() {
  return <>
    <SearchBar/>
    <DisplayContent/>
    <Footer />
  </>
}