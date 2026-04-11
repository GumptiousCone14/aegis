import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { recentEvents } from "@/data/mock-data";
import { cn } from "@/lib/utils";

export function RecentEvents() {
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "default";
    }
  };
  
  const getBadgeColor = (status: string) => {
    if (status === 'Blocked' || status === 'Blocked IP') return 'bg-red-500/20 text-red-400';
    if (status === 'Needs Patch' || status === 'Monitored') return 'bg-yellow-500/20 text-yellow-400';
    if (status === 'Resolved') return 'bg-green-500/20 text-green-400';
    return 'bg-primary/20 text-primary-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Security Events</CardTitle>
        <CardDescription>
          A log of recent activities and threats detected.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentEvents.map((event, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <event.icon className={cn("h-5 w-5", 
                        event.level === "critical" && "text-destructive",
                        event.level === "warning" && "text-yellow-400",
                        event.level === "info" && "text-green-400"
                    )} />
                    <div>
                      <div className="font-medium">{event.type}</div>
                      <div className="text-sm text-muted-foreground hidden md:inline">
                        {event.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                   <Badge variant={getBadgeVariant(event.level)} className={getBadgeColor(event.status)}>
                     {event.status}
                   </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-xs">
                  {event.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
