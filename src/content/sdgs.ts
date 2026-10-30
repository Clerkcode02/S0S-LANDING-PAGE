export interface SustainableDevelopmentGoal {
  number: 3 | 5 | 9 | 10 | 11 | 13 | 16 | 17;
  title: string;
  description: string;
  icon: string;
}

export const sdgSection = {
  eyebrow: "SUSTAINABLE DEVELOPMENT GOALS",
  headline: "Our Commitment to the Sustainable Development Goals",
  intro:
    "SOS: COMMUNITY APP contributes to the United Nations Sustainable Development Goals by helping communities report emergencies and public concerns while supporting clear, coordinated incident review and response.",
  logo: "/images/sdg-icon/sdg-logo.png",
  goals: [
    {
      number: 3,
      title: "Good Health and Well-Being",
      description:
        "Emergency and rescue reporting, location details, and coordinated review help authorized personnel assign appropriate responders for health-related incidents.",
      icon: "/images/sdg-icon/sdg-3.png",
    },
    {
      number: 5,
      title: "Gender Equality",
      description:
        "A dedicated reporting pathway for violence and vulnerable-sector concerns helps bring safety issues to authorized personnel for review and coordinated response.",
      icon: "/images/sdg-icon/sdg-5.png",
    },
    {
      number: 9,
      title: "Industry, Innovation and Infrastructure",
      description:
        "The platform connects citizen reporting, operations-center review, responder assignment, location information, and status records in one digital response workflow.",
      icon: "/images/sdg-icon/sdg-9.png",
    },
    {
      number: 10,
      title: "Reduced Inequalities",
      description:
        "Reporting categories for incidents involving persons with disabilities, senior citizens, and other vulnerable sectors help make community concerns visible to authorized personnel.",
      icon: "/images/sdg-icon/sdg-10.png",
    },
    {
      number: 11,
      title: "Sustainable Cities and Communities",
      description:
        "Community reporting for emergencies, public-safety concerns, traffic incidents, flooding, and infrastructure hazards supports safer, more resilient communities.",
      icon: "/images/sdg-icon/sdg-11.png",
    },
    {
      number: 13,
      title: "Climate Action",
      description:
        "Flooding and typhoon-related incident reporting gives operations centers structured information to review, assign, monitor, and coordinate an appropriate response.",
      icon: "/images/sdg-icon/sdg-13.png",
    },
    {
      number: 16,
      title: "Peace, Justice and Strong Institutions",
      description:
        "Structured reports, recorded status changes, timestamps, and response records support transparency and accountability across the incident workflow.",
      icon: "/images/sdg-icon/sdg-16.png",
    },
    {
      number: 17,
      title: "Partnerships for the Goals",
      description:
        "A shared flow connects citizens, operations centers, and appropriate responders so incident information can move from report through review, assignment, and response.",
      icon: "/images/sdg-icon/sdg-17.png",
    },
  ] satisfies SustainableDevelopmentGoal[],
} as const;
