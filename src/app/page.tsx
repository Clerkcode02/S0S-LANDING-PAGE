import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Categories } from "@/components/sections/Categories";
import { Showcase } from "@/components/sections/Showcase";
import { Register } from "@/components/sections/Register";
import { Tracking } from "@/components/sections/Tracking";
import { Coordination } from "@/components/sections/Coordination";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

// page.tsx only composes sections — all copy, config, and motion logic live in
// src/content, src/config, and src/components. See CLAUDE.md ("Architecture rules").
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
      <Categories />
      <Showcase />
      <Register />
      <Tracking />
      <Coordination />
      <Faq />
      <FinalCta />
    </>
  );
}
