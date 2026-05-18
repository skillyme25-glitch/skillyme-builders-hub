export type FAQCategory = "Submissions" | "Platform" | "Mentors" | "Payments" | "Gala";

export interface FAQ {
  q: string;
  a: string;
  cat: FAQCategory;
}

export const FAQ_CATEGORIES: FAQCategory[] = ["Submissions", "Platform", "Mentors", "Payments", "Gala"];

export const FAQS: FAQ[] = [
  { cat: "Submissions", q: "Can I edit a submission after I have submitted?",
    a: "No. Submissions are locked at the point of submission. If you submitted the wrong file, contact support immediately and we will review on a case-by-case basis." },
  { cat: "Submissions", q: "What happens if I miss a Wednesday check-in?",
    a: "A missed check-in is recorded. Three consecutive missed check-ins triggers an automatic escalation to your project coordinator." },
  { cat: "Submissions", q: "Does the Sunday submission need all 10 team members to sign off?",
    a: "No. The technical lead, sales lead, and project manager must mark as reviewed. The full team is encouraged to review but it is not required." },
  { cat: "Platform", q: "I cannot log in. What do I do?",
    a: "Contact support immediately via the ticket form below. Include your email address and the error message you see." },
  { cat: "Platform", q: "My team member is not appearing in my workspace.",
    a: "Team rosters are finalised by Barry Yaola. If someone is missing, submit a ticket with their name and email." },
  { cat: "Mentors", q: "What if my mentor does not show up to a session?",
    a: "Message the Mentor Coordinator via the support ticket form. We will reschedule within 24 hours." },
  { cat: "Mentors", q: "Can I contact my mentor outside of scheduled sessions?",
    a: "You may message your mentor directly. However, mentor sessions are the guaranteed touchpoint — outside contact is at the mentor's discretion." },
  { cat: "Payments", q: "I paid but my platform access has not been activated.",
    a: "Send your M-Pesa confirmation to payments@skillyme.africa with your full name. Access is activated within 2 hours during working hours." },
  { cat: "Payments", q: "Can I get a refund?",
    a: "Refunds are governed by the Participant Agreement signed at acceptance. Review Section 4 of your agreement or contact support." },
  { cat: "Gala", q: "Is the gala physical or virtual?",
    a: "The gala is a physical event in Nairobi on July 2 and 3, 2026. Location details will be shared by June 25." },
  { cat: "Gala", q: "Who attends the gala?",
    a: "All 100 participants, the judging panel, invited industry buyers, and the Skillyme Africa team." },
];
