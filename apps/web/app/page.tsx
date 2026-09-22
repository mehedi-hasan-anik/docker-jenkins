import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  SiteHeader,
  ThemeToggle,
} from "@workspace/ui";
import { APP_NAME, formatDate } from "@workspace/shared";

const features = [
  {
    title: "Turborepo orchestration",
    description: "Cached, parallel pipelines for build, lint, type-check, and dev across every workspace.",
  },
  {
    title: "Shared UI primitives",
    description: "Buttons, cards, badges, inputs — all sourced from @workspace/ui for visual consistency.",
  },
  {
    title: "shadcn-style theming",
    description: "CSS variables drive dark mode and the brand palette, exposed via Tailwind preset.",
  },
  {
    title: "Production-ready deploy",
    description: "Multi-stage Dockerfiles plus Nginx reverse-proxy compose, ready for subdomains.",
  },
];

export default function HomePage() {
  const today = formatDate(new Date());

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        navItems={[
          { href: "#features", label: "Features" },
          { href: "#stack", label: "Stack" },
        ]}
        ctaHref="http://admin.localhost"
        ctaLabel="Open admin"
      />
      <main className="flex-1">
        <section className="container py-20 md:py-28">
          <div className="flex flex-col items-center text-center">
            <Badge variant="outline" className="mb-4">
              {APP_NAME} · {today}-Test
            </Badge>
            <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-6xl">
              Ship a multi-app Next.js stack with one command.
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              A Turborepo monorepo with a marketing site and an admin dashboard, shared
              components, and an Nginx reverse proxy — all wired together.
            </p>
            <div className="mt-10 flex items-center gap-3">
              <Button asChild size="lg" variant="brand">
                <Link href="#features">Explore the stack</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="http://admin.localhost" rel="noreferrer">
                  Visit admin
                </a>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </section>

        <section id="features" className="container border-t py-16">
          <h2 className="mb-10 text-3xl font-bold tracking-tight">Everything in one repo</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            ))}
          </div>
        </section>

        <section id="stack" className="container border-t py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Web app</CardTitle>
                <CardDescription>apps/web</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Runs on port 3000 inside Docker, exposed at{" "}
                <code className="rounded bg-muted px-1.5 py-0.5">web.localhost</code> via Nginx.
              </CardContent>
              <CardFooter>
                <Badge variant="secondary">Next.js 14 · App Router</Badge>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Admin app</CardTitle>
                <CardDescription>apps/admin</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Runs on port 3000 internally, exposed at{" "}
                <code className="rounded bg-muted px-1.5 py-0.5">admin.localhost</code> via Nginx.
              </CardContent>
              <CardFooter>
                <Badge variant="secondary">Next.js 14 · App Router</Badge>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t py-8">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <p>{APP_NAME}</p>
          <p>Built with Turborepo, Next.js, Tailwind, and shadcn/ui.</p>
        </div>
      </footer>
    </div>
  );
}
