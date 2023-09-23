import { LandingPageMemberStats } from "./landingPage/memberStats/landingPageMemberStats";
import { LandingPageCTASection } from "./landingPage/CTASection/landingPageCTASection";
import { LandingPageSaveSection } from "./landingPage/saveSection/landingPageSaveSection";
import { LandingPageSimpleSection } from "./landingPage/simpeSection/landingPageSimpleSection";
import { Footer } from "./footer/footer";
import { LandingPageHeader } from "./landingPage/header/header";
export function NewUserLandingPage() {

    return (
        <div className="flex justify-center flex-col w-full">
            <LandingPageHeader />
            <LandingPageSaveSection />
            <LandingPageSimpleSection />
            <LandingPageMemberStats />
            <LandingPageCTASection />
            <Footer />
        </div >
    )
}