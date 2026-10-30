import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { ResponseSystem } from "@/components/sections/ResponseSystem";
import { StepOneShowcase } from "@/components/sections/StepOneShowcase";
import { AppResponseDemo } from "@/components/sections/AppResponseDemo";
import { Categories } from "@/components/sections/Categories";
import { Showcase } from "@/components/sections/Showcase";
import { Register } from "@/components/sections/Register";
import { Tracking } from "@/components/sections/Tracking";
import { Coordination } from "@/components/sections/Coordination";
import { SustainableDevelopmentGoals } from "@/components/sections/SustainableDevelopmentGoals";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

// page.tsx composes sections — all copy, config, and motion logic live in
// src/content, src/config, and src/components. See CLAUDE.md ("Architecture rules").
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ResponseSystem />
      <StepOneShowcase />
      <AppResponseDemo />
      <Categories />
      <Showcase />
      <Register />
      <Tracking />
      <Coordination />
      <SustainableDevelopmentGoals />
      <Faq />
      <FinalCta />
    </>
  );
}
