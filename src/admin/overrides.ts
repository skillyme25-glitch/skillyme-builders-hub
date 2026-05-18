// Admin override layer. Persists edits to localStorage and mutates the
// in-memory mock data exports at boot so the rest of the app can stay
// unchanged. Reload required after a save for changes to render.

import { NEXT_DEADLINE, PROJECT_BRIEF, WEEKS, MENTOR, TEAM } from "@/data/mock";
import { PROJECTS, EVENTS } from "@/data/directory";
import { FAQS } from "@/data/faqs";

const KEY = "skillyme-admin-overrides-v1";

export interface AdminOverrides {
  deadline?: typeof NEXT_DEADLINE;
  projectBrief?: string[];
  weeks?: typeof WEEKS;
  mentor?: typeof MENTOR;
  teamBuilders?: typeof TEAM.builders;
  teamMeta?: { name: string; project: string };
  projects?: { slug: string; name: string; oneLiner: string }[];
  events?: typeof EVENTS;
  faqs?: typeof FAQS;
}

export const loadOverrides = (): AdminOverrides => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveOverrides = (o: AdminOverrides) => {
  localStorage.setItem(KEY, JSON.stringify(o));
};

export const resetOverrides = () => {
  localStorage.removeItem(KEY);
};

/** Mutate-in-place defaults read from localStorage. Call before render. */
export const applyOverrides = () => {
  const o = loadOverrides();

  if (o.deadline) Object.assign(NEXT_DEADLINE, o.deadline);

  if (o.projectBrief) {
    PROJECT_BRIEF.splice(0, PROJECT_BRIEF.length, ...o.projectBrief);
  }

  if (o.weeks) {
    WEEKS.splice(0, WEEKS.length, ...o.weeks);
  }

  if (o.mentor) Object.assign(MENTOR, o.mentor);

  if (o.teamMeta) Object.assign(TEAM, o.teamMeta);
  if (o.teamBuilders) {
    TEAM.builders.splice(0, TEAM.builders.length, ...o.teamBuilders);
  }

  if (o.projects) {
    o.projects.forEach((p) => {
      const target = PROJECTS.find((x) => x.slug === p.slug);
      if (target) {
        target.name = p.name;
        target.oneLiner = p.oneLiner;
      }
    });
  }

  if (o.events) {
    EVENTS.splice(0, EVENTS.length, ...o.events);
  }

  if (o.faqs) {
    FAQS.splice(0, FAQS.length, ...o.faqs);
  }
};

/** Snapshot of current (post-override) values for the admin UI. */
export const currentSnapshot = () => ({
  deadline: { ...NEXT_DEADLINE },
  projectBrief: [...PROJECT_BRIEF],
  weeks: JSON.parse(JSON.stringify(WEEKS)) as typeof WEEKS,
  mentor: JSON.parse(JSON.stringify(MENTOR)) as typeof MENTOR,
  teamMeta: { name: TEAM.name, project: TEAM.project },
  teamBuilders: JSON.parse(JSON.stringify(TEAM.builders)) as typeof TEAM.builders,
  projects: PROJECTS.map((p) => ({ slug: p.slug, name: p.name, oneLiner: p.oneLiner })),
  events: JSON.parse(JSON.stringify(EVENTS)) as typeof EVENTS,
  faqs: JSON.parse(JSON.stringify(FAQS)) as typeof FAQS,
});
