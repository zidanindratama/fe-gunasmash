export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-3xl font-bold uppercase tracking-wide">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome back, Captain. Here's what's happening today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Total Members
          </h3>
          <p className="text-3xl font-bold mt-2">142</p>
        </div>
      </div>
    </div>
  );
}
