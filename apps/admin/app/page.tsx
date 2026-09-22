import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  SiteHeader,
  ThemeToggle,
} from "@workspace/ui";
import { APP_NAME, DEFAULT_PAGE_SIZE, type User } from "@workspace/shared";
import { UsersTable } from "./users-table";
import { StatsCards } from "./stats-cards";

const mockUsers: User[] = [
  { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "admin" },
  { id: "2", name: "Alan Turing", email: "alan@example.com", role: "user" },
  { id: "3", name: "Grace Hopper", email: "grace@example.com", role: "admin" },
  { id: "4", name: "Linus Torvalds", email: "linus@example.com", role: "user" },
  { id: "5", name: "Margaret Hamilton", email: "margaret@example.com", role: "user" },
];

export default function AdminHomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        brand="Admin Console"
        navItems={[
          { href: "/", label: "Overview" },
          { href: "#users", label: "Users" },
          { href: "#settings", label: "Settings" },
        ]}
        ctaHref="http://web.localhost"
        ctaLabel="View public site"
      />
      <main className="container flex-1 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of {APP_NAME}, page size {DEFAULT_PAGE_SIZE}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Environment: dev</Badge>
            <ThemeToggle />
          </div>
        </div>

        <section className="mb-10">
          <StatsCards />
        </section>

        <Separator className="my-8" />

        <section id="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-sm text-muted-foreground">
                Sample data sourced from the shared types package.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="#users">Invite member</Link>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Active members</CardTitle>
              <CardDescription>
                Showing {mockUsers.length} accounts. Data is mocked for the demo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable users={mockUsers} />
            </CardContent>
          </Card>
        </section>

        <section id="settings" className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>
                Manage the workspace-wide configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border p-4">
                <p className="text-sm font-medium">Region</p>
                <p className="text-sm text-muted-foreground">us-east-1</p>
              </div>
              <div className="rounded-md border p-4">
                <p className="text-sm font-medium">Plan</p>
                <p className="text-sm text-muted-foreground">Team</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <p>{APP_NAME} · Admin</p>
          <p>Powered by Turborepo.</p>
        </div>
      </footer>
    </div>
  );
}
