// Centralised mock data for the Skillyme Africa Track One participant platform.
// Replace with Lovable Cloud queries when the backend is wired up.

export type SubmissionStatus =
  | "upcoming"
  | "active"
  | "open"
  | "in_review"
  | "submitted"
  | "missed";

export interface Builder {
  id: string;
  name: string;
  initials: string;
  role: string;
  roleDetail: string;
  country: string;
  countryFlag: string;
  activeToday?: boolean;
  isViewer?: boolean;
}

export interface Mentor {
  name: string;
  bio: string;
  industry: string;
  initials: string;
  sessions: { date: string; focus: string; meetUrl: string; past?: boolean }[];
}

export interface WeekPlan {
  number: number;
  dateRange: string;
  theme: string;
  status: "upcoming" | "active" | "submitted" | "missed";
  expectations: string[];
  checkIn: {
    dueLabel: string;
    status: SubmissionStatus;
  };
  teamSubmission: {
    dueLabel: string;
    status: SubmissionStatus;
    reviewedBy: string[]; // builder ids who have signed off
    deliverableSummary: string;
  };
}

export const VIEWER_ID = "b-a-04";

export const TEAM: { name: string; project: string; builders: Builder[] } = {
  name: "Real Estate — Team A",
  project: "Real Estate Management",
  builders: [
    { id: "b-a-01", name: "Achieng Otieno", initials: "AO", role: "Project Manager", roleDetail: "Project lead — 6 years coordinating cross-functional African tech teams", country: "Kenya", countryFlag: "🇰🇪", activeToday: true },
    { id: "b-a-02", name: "Tendai Moyo", initials: "TM", role: "Technical Lead", roleDetail: "Full-stack engineer — 8 years across fintech and proptech", country: "Zimbabwe", countryFlag: "🇿🇼", activeToday: true },
    { id: "b-a-03", name: "Kwame Mensah", initials: "KM", role: "Sales Lead", roleDetail: "Enterprise sales — 5 years selling SaaS into property developers", country: "Ghana", countryFlag: "🇬🇭", activeToday: false },
    { id: "b-a-04", name: "Amara Diallo", initials: "AD", role: "Developer", roleDetail: "Full-Stack Developer — 4 years in fintech and proptech", country: "Senegal", countryFlag: "🇸🇳", activeToday: true, isViewer: true },
    { id: "b-a-05", name: "Sipho Ndlovu", initials: "SN", role: "Developer", roleDetail: "Backend engineer — 5 years building marketplace systems", country: "South Africa", countryFlag: "🇿🇦", activeToday: true },
    { id: "b-a-06", name: "Fatima Hassan", initials: "FH", role: "Designer", roleDetail: "Product designer — 4 years in B2B SaaS interfaces", country: "Tanzania", countryFlag: "🇹🇿", activeToday: false },
    { id: "b-a-07", name: "Chinedu Okafor", initials: "CO", role: "Researcher", roleDetail: "User researcher — 3 years in property and housing studies", country: "Nigeria", countryFlag: "🇳🇬", activeToday: true },
    { id: "b-a-08", name: "Mariam Kone", initials: "MK", role: "Operations", roleDetail: "Ops & finance — 6 years scaling early-stage startups", country: "Mali", countryFlag: "🇲🇱", activeToday: false },
    { id: "b-a-09", name: "Brian Wanjiku", initials: "BW", role: "Marketing Lead", roleDetail: "Growth marketing — 4 years across East African consumer brands", country: "Kenya", countryFlag: "🇰🇪", activeToday: true },
    { id: "b-a-10", name: "Zara Abebe", initials: "ZA", role: "Customer Success", roleDetail: "CS lead — 3 years onboarding SMB clients in property", country: "Ethiopia", countryFlag: "🇪🇹", activeToday: false },
  ],
};

export const MENTOR: Mentor = {
  name: "James Kariuki",
  initials: "JK",
  bio: "Twelve years building and selling property management systems across East Africa. Former CTO at a Nairobi-based proptech acquired in 2023.",
  industry: "Real Estate — 12 years, Kenya Property Developers Association",
  sessions: [
    { date: "Tuesday, May 27 · 16:00 EAT", focus: "Week 1 Review — Problem Statement", meetUrl: "https://meet.google.com/abc-defg-hij" },
    { date: "Tuesday, June 3 · 16:00 EAT", focus: "Week 2 Review — User Research & Wireframes", meetUrl: "https://meet.google.com/abc-defg-hij" },
    { date: "Tuesday, June 10 · 16:00 EAT", focus: "Mid-Sprint Showcase Prep", meetUrl: "https://meet.google.com/abc-defg-hij" },
    { date: "Tuesday, May 20 · 16:00 EAT", focus: "Pre-sprint Orientation", meetUrl: "#", past: true },
  ],
};

export const PROJECT_BRIEF = [
  "African property managers operate without the digital infrastructure their counterparts in mature markets take for granted. Rent collection happens over WhatsApp. Maintenance requests are lost in voice notes. Tenant records sit in paper ledgers behind reception desks across Nairobi, Lagos, and Accra.",
  "The opportunity is not to copy Western property management software. It is to design for the actual workflows of an African property manager — multi-tenant compounds, M-Pesa and mobile money rent flows, informal maintenance networks, and landlords who manage portfolios from a phone, not a laptop.",
  "Your team has six weeks to ship a product a real Nairobi property manager would pay for on day one. The judging panel includes two managing directors of property firms with combined portfolios exceeding 4,000 units. They will tell you, on July 3, whether they would buy.",
];

export const WEEKS: WeekPlan[] = [
  {
    number: 1,
    dateRange: "May 25 — May 31",
    theme: "Problem Definition",
    status: "submitted",
    expectations: [
      "Map the core problem your team is solving",
      "Interview at least 3 potential users",
      "Agree on internal team roles",
      "Submit your Problem Statement document by Sunday",
    ],
    checkIn: { dueLabel: "Due Wednesday, May 28 · 23:59 EAT", status: "submitted" },
    teamSubmission: {
      dueLabel: "Due Sunday, June 1 · 23:59 EAT",
      status: "submitted",
      reviewedBy: ["b-a-01", "b-a-02", "b-a-03", "b-a-04", "b-a-05", "b-a-07", "b-a-09"],
      deliverableSummary:
        "A one-page Problem Statement document identifying the specific problem, the target user, and the current workaround — maximum 500 words.",
    },
  },
  {
    number: 2,
    dateRange: "June 1 — June 7",
    theme: "User Research & Wireframes",
    status: "active",
    expectations: [
      "Complete 3 deep user interviews with property managers in your city",
      "Synthesise insights into a user journey map",
      "Produce wireframes for the core product flow",
      "Lock the technology stack with the technical lead",
    ],
    checkIn: { dueLabel: "Due Wednesday, June 4 · 23:59 EAT", status: "open" },
    teamSubmission: {
      dueLabel: "Due Sunday, June 8 · 23:59 EAT",
      status: "upcoming",
      reviewedBy: ["b-a-04", "b-a-07"],
      deliverableSummary:
        "3 user interview summaries (PDF or Doc link), core product wireframes (Figma or PDF), and a written rationale for your chosen technology stack.",
    },
  },
  {
    number: 3,
    dateRange: "June 8 — June 14",
    theme: "First Build — Core Loop",
    status: "upcoming",
    expectations: [
      "Ship a working prototype of the single most important user flow",
      "Internal demo to mentor mid-week",
      "Begin onboarding your first test user",
    ],
    checkIn: { dueLabel: "Due Wednesday, June 11 · 23:59 EAT", status: "upcoming" },
    teamSubmission: {
      dueLabel: "Due Sunday, June 15 · 23:59 EAT",
      status: "upcoming",
      reviewedBy: [],
      deliverableSummary:
        "A working prototype link (hosted, not local) plus a 60-second video walkthrough of the core user flow.",
    },
  },
  {
    number: 4,
    dateRange: "June 15 — June 21",
    theme: "Test, Break, Iterate",
    status: "upcoming",
    expectations: [
      "Onboard at least 2 real users",
      "Capture all blocking bugs and friction points",
      "Iterate the product based on what you observed, not what users said",
    ],
    checkIn: { dueLabel: "Due Wednesday, June 18 · 23:59 EAT", status: "upcoming" },
    teamSubmission: {
      dueLabel: "Due Sunday, June 22 · 23:59 EAT",
      status: "upcoming",
      reviewedBy: [],
      deliverableSummary: "Iteration log, updated prototype link, and a written user testing report.",
    },
  },
  {
    number: 5,
    dateRange: "June 22 — June 28",
    theme: "Polish & Pricing",
    status: "upcoming",
    expectations: [
      "Lock the MVP feature set",
      "Define your pricing model and go-to-market hypothesis",
      "Prepare your gala pitch deck — first draft",
    ],
    checkIn: { dueLabel: "Due Wednesday, June 25 · 23:59 EAT", status: "upcoming" },
    teamSubmission: {
      dueLabel: "Due Sunday, June 29 · 23:59 EAT",
      status: "upcoming",
      reviewedBy: [],
      deliverableSummary: "Pitch deck (PDF), pricing model document, and updated hosted product link.",
    },
  },
  {
    number: 6,
    dateRange: "June 29 — July 3",
    theme: "Ship & Present",
    status: "upcoming",
    expectations: [
      "Submit final MVP by Monday June 30",
      "Pitch rehearsal with mentor on Tuesday",
      "Gala Day 1 — Judging on Thursday July 2",
      "Gala Day 2 — Buyer presentations on Friday July 3",
    ],
    checkIn: { dueLabel: "Due Wednesday, July 2 · 12:00 EAT", status: "upcoming" },
    teamSubmission: {
      dueLabel: "Final MVP — Due Monday, June 30 · 23:59 EAT",
      status: "upcoming",
      reviewedBy: [],
      deliverableSummary: "Final hosted product, full source repository, gala pitch deck, and signed go-to-market plan.",
    },
  },
];

// Next deadline (drives the global banner). For demo: a near deadline.
export const NEXT_DEADLINE = {
  title: "Week 2 Check-In",
  dateLabel: "Wednesday, June 4",
  hoursRemaining: 31,
  totalWindowHours: 168, // one week
};
