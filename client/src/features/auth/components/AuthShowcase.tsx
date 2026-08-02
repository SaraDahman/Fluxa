import {
  Workflow,
  KanbanSquare,
  Users,
  GitBranch,
  SquareKanban,
  Rocket,
  LayoutList,
} from "lucide-react";

const features = [
  {
    icon: KanbanSquare,
    title: "Kanban boards",
    desc: "Drag, drop, and ship work across customizable stages.",
  },
  {
    icon: GitBranch,
    title: "Sprint planning",
    desc: "Plan sprints with automatic capacity and velocity insights.",
  },
  {
    icon: Users,
    title: "Team workspaces",
    desc: "Invite teammates and keep everyone in lockstep.",
  },
  {
    icon: Workflow,
    title: "Issue tracking",
    desc: "Track bugs, tasks, and epics with rich linked context.",
  },
];

const steps = [
  { icon: LayoutList, title: "Capture", desc: "Log bugs, tasks, and epics in one shared backlog." },
  {
    icon: KanbanSquare,
    title: "Organize",
    desc: "Drag work across boards and group it into sprints.",
  },
  { icon: Rocket, title: "Ship", desc: "Track progress in real time and release with confidence." },
];

export function AuthShowcase() {
  return (
    <div className="relative hidden h-full w-full overflow-hidden brand-gradient lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* animated grid + glow backdrop */}
      <div className="absolute inset-0 grid-overlay opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-showcase-glow-1/40 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-showcase-glow-2/90 blur-3xl animate-float-slow" />

      {/* brand */}
      <div className="relative z-10 flex items-center gap-2.5 text-showcase-text">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
          <SquareKanban className="h-5 w-5" />
        </div>
        <span className="text-xl font-semibold tracking-tight">Fluxa</span>
      </div>

      {/* headline */}
      <div className="relative z-10 max-w-lg text-showcase-text">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-showcase-accent animate-pulse-soft" />
            Built for modern software teams
          </div>
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight animate-fade-up">
            Where teams plan, track, and ship great software.
          </h1>
          <p className="text-balance text-base leading-relaxed text-white/70 animate-fade-up [animation-delay:120ms]">
            Workspaces, sprints, Kanban, and real-time collaboration — unified in one fast, focused
            platform.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur transition-all hover:border-white/25 hover:bg-white/10 animate-fade-up"
              style={{ animationDelay: `${200 + i * 90}ms` }}
            >
              <f.icon className="h-5 w-5 text-showcase-accent" />
              <p className="mt-3 text-sm font-medium text-white">{f.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* how it works footer */}
      <div className="relative z-10 max-w-lg animate-fade-up [animation-delay:560ms]">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-white/50">
          How Fluxa works
        </p>
        <div className="grid gap-2.5">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                style={{
                  background:
                    "linear-gradient(135deg, var(--showcase-glow-1), var(--showcase-glow-2))",
                }}
              >
                <s.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-white/40">0{i + 1}</span>
                  <p className="text-sm font-medium text-white">{s.title}</p>
                </div>
                <p className="mt-0.5 text-xs leading-snug text-white/55">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
