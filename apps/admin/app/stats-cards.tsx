import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui";

const stats = [
  { label: "Total users", value: "1,284", change: "+12.4%" },
  { label: "Active sessions", value: "312", change: "+5.1%" },
  { label: "Errors (24h)", value: "7", change: "-32.0%" },
  { label: "Deploys (7d)", value: "23", change: "+4 today" },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="text-3xl">{stat.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{stat.change} vs last period</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
