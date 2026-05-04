import { AppShell } from "@/components/layout/AppShell";
import { EditorialButton } from "@/components/ui/editorial-button";

interface ComingSoonProps {
  eyebrow: string;
  title: string;
  body: string;
}

const ComingSoon = ({ eyebrow, title, body }: ComingSoonProps) => (
  <AppShell>
    <section className="px-6 md:px-12 py-32 md:py-40 min-h-[70vh] flex items-center">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto block h-px w-[120px] bg-primary/70 mb-8" />
        <p className="label-eyebrow mb-6">{eyebrow}</p>
        <h1 className="font-serif-display text-4xl md:text-6xl font-light mb-8">
          {title}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-12">
          {body}
        </p>
        <span className="mx-auto block h-px w-[120px] bg-primary/70 mb-12" />
        <EditorialButton variant="secondary" to="/workspace">
          Return to Workspace
        </EditorialButton>
      </div>
    </section>
  </AppShell>
);

export default ComingSoon;
