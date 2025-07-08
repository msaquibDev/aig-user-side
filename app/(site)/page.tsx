import React from "react";
import HeroSection from "../components/home/HeroSection";
import BrowseByDepartment from "../components/home/BrowseByDepartment";
import UpcomingConferences from "../components/home/UpcomingConferences";
import UpcomingWorkshops from "../components/home/UpcomingWorkshops";
import UpcomingCMEs from "../components/home/UpcomingCMEs";
import AboutUs from "../components/home/AboutUs";

export default function HomePage() {
  return (
    <>
      <section id="home">
        <HeroSection />
      </section>

      <section id="department" className="scroll-mt-20">
        <BrowseByDepartment />
      </section>

      <section id="conferences" className="scroll-mt-20">
        <UpcomingConferences />
      </section>

      <section id="workshops" className="scroll-mt-20">
        <UpcomingWorkshops />
      </section>

      <section id="cmes" className="scroll-mt-20">
        <UpcomingCMEs />
      </section>

      <section id="about" className="scroll-mt-20">
        <AboutUs />
      </section>
    </>
  );
}
