// Project + team directory and calendar event data for Track One.
import { Building2, Truck, BarChart3, Leaf, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DirectoryBuilder {
  id: string;
  name: string;
  initials: string;
  role: string;
  roleDetail: string;
  country: string;
  countryFlag: string;
}

export interface DirectoryTeam {
  id: string;
  letter: "A" | "B";
  builders: DirectoryBuilder[];
}

export interface DirectoryProject {
  number: string;
  slug: string;
  name: string;
  oneLiner: string;
  icon: LucideIcon;
  teams: [DirectoryTeam, DirectoryTeam];
}

const ROLES = [
  "Project Manager", "Technical Lead", "Sales Lead", "Developer", "Developer",
  "Designer", "Researcher", "Operations", "Marketing Lead", "Customer Success",
];

const ROLE_DETAILS: Record<string, string> = {
  "Project Manager": "Project lead with multi-year experience coordinating cross-functional African tech teams.",
  "Technical Lead": "Senior engineer responsible for architecture, code quality, and shipping the MVP on deadline.",
  "Sales Lead": "Owns the go-to-market motion, customer interviews, and the gala buyer pitch.",
  "Developer": "Full-stack builder shipping the core product flows week after week.",
  "Designer": "Product designer turning research into wireframes, flows, and a finished interface.",
  "Researcher": "User researcher running interviews and synthesising the team's insight base.",
  "Operations": "Ops and finance — keeps the team unblocked, scheduled, and on budget.",
  "Marketing Lead": "Owns positioning, narrative, and the launch story for gala day.",
  "Customer Success": "Onboards the first test users and captures feedback into the product loop.",
};

// First names / surnames pool (varied African origins) — deterministic per seat
const FIRSTS = [
  "Achieng","Tendai","Kwame","Amara","Sipho","Fatima","Chinedu","Mariam","Brian","Zara",
  "Nia","Kofi","Aisha","Tawanda","Lerato","Yusuf","Wanjiru","Obi","Halima","Sefu",
  "Imani","Babatunde","Naledi","Rashid","Adaeze","Mosi","Thandiwe","Jelani","Ayana","Femi",
  "Esi","Bongani","Zuri","Ade","Chiamaka","Tau","Lulu","Idris","Nadia","Kagiso",
  "Folake","Mwangi","Asha","Sade","Tariro","Onyeka","Bisi","Kabelo","Rehema","Nuru",
  "Dele","Selma","Tafadzwa","Bola","Kamau","Linda","Joseph","Khadija","Tunde","Ngozi",
  "Pumla","Otieno","Salma","Mandla","Dami","Ife","Boitumelo","Nasir","Yewande","Ezekiel",
  "Halle","Sade","Solomon","Ebele","Marcus","Naomi","Bantu","Aida","Issa","Wambui",
  "Eshe","Hakim","Zola","Tomi","Dada","Themba","Adanna","Sade","Gugu","Musa",
  "Subira","Niko","Aluna","Gbenga","Anaya","Damilola","Sanaa","Babs","Thuli","Femi",
];
const SURNAMES = [
  "Otieno","Moyo","Mensah","Diallo","Ndlovu","Hassan","Okafor","Kone","Wanjiku","Abebe",
  "Mwangi","Adeyemi","Okonkwo","Nkomo","Juma","Sankara","Eze","Owusu","Bakari","Mahlangu",
  "Sankoh","Kamara","Ouattara","Sibanda","Achebe","Diop","Cisse","Banda","Tutu","Obi",
  "Ngugi","Mutua","Asante","Toure","Khumalo","Olawale","Babangida","Soyinka","Mbeki","Dlamini",
  "Adichie","Iwobi","Mensa","Sow","Dube","Chuma","Mokoena","Chinaka","Yeboah","Ade",
];
const COUNTRIES: { name: string; flag: string }[] = [
  { name: "Kenya", flag: "🇰🇪" },{ name: "Nigeria", flag: "🇳🇬" },{ name: "South Africa", flag: "🇿🇦" },
  { name: "Ghana", flag: "🇬🇭" },{ name: "Senegal", flag: "🇸🇳" },{ name: "Tanzania", flag: "🇹🇿" },
  { name: "Uganda", flag: "🇺🇬" },{ name: "Ethiopia", flag: "🇪🇹" },{ name: "Rwanda", flag: "🇷🇼" },
  { name: "Zimbabwe", flag: "🇿🇼" },{ name: "Mali", flag: "🇲🇱" },{ name: "Côte d'Ivoire", flag: "🇨🇮" },
];

const initialsOf = (name: string) =>
  name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const makeTeam = (
  projectIndex: number,
  letter: "A" | "B",
  /** When defined, replaces the seat at the given index with the viewer */
  viewerSeat?: { index: number; builder: DirectoryBuilder },
): DirectoryTeam => {
  const teamIdx = projectIndex * 2 + (letter === "A" ? 0 : 1);
  const builders: DirectoryBuilder[] = ROLES.map((role, i) => {
    const seed = teamIdx * 10 + i;
    const first = FIRSTS[(seed * 7) % FIRSTS.length];
    const last = SURNAMES[(seed * 13) % SURNAMES.length];
    const country = COUNTRIES[(seed * 5) % COUNTRIES.length];
    const name = `${first} ${last}`;
    return {
      id: `p${projectIndex}-${letter}-${i}`,
      name,
      initials: initialsOf(name),
      role,
      roleDetail: `${role} — ${ROLE_DETAILS[role]}`,
      country: country.name,
      countryFlag: country.flag,
    };
  });
  if (viewerSeat) builders[viewerSeat.index] = viewerSeat.builder;
  return { id: `team-${projectIndex}-${letter}`, letter, builders };
};

// The viewer is Amara Diallo, seat 4 of Real Estate Team A (project 0).
const viewerBuilder: DirectoryBuilder = {
  id: "b-a-04",
  name: "Amara Diallo",
  initials: "AD",
  role: "Developer",
  roleDetail: "Full-Stack Developer — 4 years in fintech and proptech.",
  country: "Senegal",
  countryFlag: "🇸🇳",
};

export const VIEWER_BUILDER_ID = viewerBuilder.id;

export const PROJECTS: DirectoryProject[] = [
  {
    number: "01",
    slug: "real-estate",
    name: "Real Estate Management",
    oneLiner: "Building the system African property managers actually need.",
    icon: Building2,
    teams: [
      makeTeam(0, "A", { index: 3, builder: viewerBuilder }),
      makeTeam(0, "B"),
    ],
  },
  {
    number: "02",
    slug: "logistics",
    name: "Last-Mile Logistics",
    oneLiner: "A delivery layer designed for African cities, not Western suburbs.",
    icon: Truck,
    teams: [makeTeam(1, "A"), makeTeam(1, "B")],
  },
  {
    number: "03",
    slug: "fintech",
    name: "SME Financial Operations",
    oneLiner: "Cash flow, invoicing and capital tools for African small businesses.",
    icon: BarChart3,
    teams: [makeTeam(2, "A"), makeTeam(2, "B")],
  },
  {
    number: "04",
    slug: "agritech",
    name: "Smallholder Agritech",
    oneLiner: "From farm to buyer with fewer middlemen and better prices.",
    icon: Leaf,
    teams: [makeTeam(3, "A"), makeTeam(3, "B")],
  },
  {
    number: "05",
    slug: "talent",
    name: "Talent & Workforce",
    oneLiner: "Matching African professional talent to the firms that need it.",
    icon: Users,
    teams: [makeTeam(4, "A"), makeTeam(4, "B")],
  },
];

/* ============================================================
   CALENDAR EVENTS
   ============================================================ */

export type EventType = "checkin" | "submission" | "mentor" | "milestone";

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm 24h, EAT
  endTime?: string;
  type: EventType;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

const ev = (
  id: string,
  date: string,
  type: EventType,
  title: string,
  description: string,
  extra: Partial<CalendarEvent> = {},
): CalendarEvent => ({ id, date, type, title, description, ...extra });

// Generate every Wednesday + Sunday across the sprint
const sprintWednesdays = ["2026-05-27", "2026-06-03", "2026-06-10", "2026-06-17", "2026-06-24", "2026-07-01"];
const sprintSundays = ["2026-05-31", "2026-06-07", "2026-06-14", "2026-06-21", "2026-06-28"];

export const EVENTS: CalendarEvent[] = [
  ev("kickoff", "2026-05-25", "milestone",
     "Sprint Kick-Off — All Hands",
     "Track One officially begins. All 100 builders join a live opening at 16:00 EAT. Attendance is mandatory.",
     { time: "16:00", endTime: "17:30", actionLabel: "View Program Brief", actionHref: "#" }),

  ...sprintWednesdays.map((d, i) =>
    ev(`checkin-${i+1}`, d, "checkin",
       "Individual Check-In Due",
       `Week ${i+1} Wednesday check-in — three short questions, due 23:59 EAT. Every builder, every Wednesday.`,
       { time: "23:59", actionLabel: "Submit Check-In", actionHref: "/submissions" })),

  ...sprintSundays.map((d, i) =>
    ev(`team-sub-${i+1}`, d, "submission",
       "Team Submission Due",
       `Week ${i+1} Sunday team deliverable — due 23:59 EAT. Requires sign-off from at least the technical lead, sales lead, and project manager.`,
       { time: "23:59", actionLabel: "Submit Deliverable", actionHref: "/submissions" })),

  ev("mentor-1", "2026-05-26", "mentor", "Mentor Session — Week 1",
     "First mentor session of the sprint. Bring your draft Problem Statement.",
     { time: "16:00", endTime: "17:00", actionLabel: "Join Google Meet", actionHref: "https://meet.google.com/abc-defg-hij" }),
  ev("mentor-2", "2026-06-02", "mentor", "Mentor Session — Week 2",
     "Review of user research and wireframes. Walk your mentor through your first three interviews.",
     { time: "16:00", endTime: "17:00", actionLabel: "Join Google Meet", actionHref: "https://meet.google.com/abc-defg-hij" }),
  ev("mentor-4", "2026-06-16", "mentor", "Mentor Session — Week 4",
     "Iteration review. Bring your latest hosted prototype and a list of blocking bugs.",
     { time: "16:00", endTime: "17:00", actionLabel: "Join Google Meet", actionHref: "https://meet.google.com/abc-defg-hij" }),
  ev("mentor-5", "2026-06-23", "mentor", "Mentor Session — Week 5",
     "Pricing and pitch. Walk through your draft pitch deck and pricing model.",
     { time: "16:00", endTime: "17:00", actionLabel: "Join Google Meet", actionHref: "https://meet.google.com/abc-defg-hij" }),

  ev("midshow", "2026-06-09", "milestone", "Mid-Sprint Showcase — All Teams",
     "Each team demos their working prototype to the rest of the cohort. 5 minute demos, 3 minutes for questions.",
     { time: "15:00", endTime: "19:00", actionLabel: "View Program Brief", actionHref: "#" }),
  ev("showcase-1", "2026-06-10", "milestone", "Builder Showcase Day 1",
     "External Builder Showcase — invited industry guests visit the cohort. Strict editorial dress code.",
     { time: "10:00", endTime: "18:00", actionLabel: "View Program Brief", actionHref: "#" }),
  ev("showcase-2", "2026-06-11", "milestone", "Builder Showcase Day 2",
     "Day two of the external Builder Showcase. Buyer office hours run all afternoon.",
     { time: "10:00", endTime: "18:00", actionLabel: "View Program Brief", actionHref: "#" }),

  ev("final-mvp", "2026-06-30", "milestone", "Final MVP Submission Due",
     "Final hosted product, source repo, gala pitch deck, and signed go-to-market plan due 23:59 EAT. No extensions.",
     { time: "23:59", actionLabel: "Submit Deliverable", actionHref: "/submissions" }),

  ev("gala-1", "2026-07-02", "milestone", "Gala Day 1 — Judging",
     "Live judging in Nairobi. Each team pitches in front of the full panel and the room.",
     { time: "14:00", endTime: "21:00", actionLabel: "View Program Brief", actionHref: "#" }),
  ev("gala-2", "2026-07-03", "milestone", "Gala Day 2 — Buyer Presentations",
     "Closed-room buyer presentations. Two products per industry meet the people writing the cheques.",
     { time: "10:00", endTime: "18:00", actionLabel: "View Program Brief", actionHref: "#" }),
];

/* ============================================================
   SUBMISSION HISTORY (current + past) for /submissions page
   ============================================================ */

export interface PastCheckIn {
  weekNumber: number;
  dateLabel: string;
  status: "submitted" | "missed";
  responses?: { completed: string; stuck: string; commit: string };
  timestamp?: string;
}

export const PAST_CHECKINS: PastCheckIn[] = [
  {
    weekNumber: 1,
    dateLabel: "Wednesday, May 28",
    status: "submitted",
    timestamp: "Submitted Wednesday May 28 at 14:32 EAT",
    responses: {
      completed:
        "Mapped three candidate problem statements across the property management space and ran a long working session with the team to converge on one. Drafted the Problem Statement document.",
      stuck:
        "We are split between focusing on landlords with 1–5 units versus mid-size property managers with 50–200 units. We need a decision before Sunday.",
      commit:
        "A signed-off Problem Statement document, plus a one-page user persona for the segment we choose.",
    },
  },
];

export interface PastTeamSubmission {
  weekNumber: number;
  dateLabel: string;
  status: "submitted" | "missed";
  deliverableLabel?: string;
  deliverableHref?: string;
  summary?: string;
  submittedBy?: string;
  timestamp?: string;
  feedback?: string;
}

export const PAST_TEAM_SUBMISSIONS: PastTeamSubmission[] = [
  {
    weekNumber: 1,
    dateLabel: "Sunday, June 1",
    status: "submitted",
    deliverableLabel: "Problem Statement v1 — Google Doc",
    deliverableHref: "#",
    summary:
      "We focused on mid-size Nairobi property managers running 50–200 units across multiple compounds. Their core pain is reconciliation: M-Pesa rent payments do not map cleanly to tenants or units, and maintenance requests scatter across WhatsApp, calls and walk-ins. We are building toward a single source of truth for collections and maintenance, with M-Pesa-native flows.",
    submittedBy: "Achieng Otieno",
    timestamp: "Submitted Sunday June 1 at 21:14 EAT",
    feedback:
      "Strong segment choice. Push harder on the maintenance workflow — that is where the wedge sits, not collections. Bring two real maintenance logs to next week's mentor session.",
  },
];

export const TOTAL_REQUIRED_SUBMISSIONS = 12; // 6 check-ins + 6 team submissions
export const COMPLETED_SUBMISSIONS = 3; // demo state
