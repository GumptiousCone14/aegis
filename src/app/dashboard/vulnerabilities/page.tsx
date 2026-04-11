import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function VulnerabilitiesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vulnerability Scanner</CardTitle>
      </CardHeader>
      <CardContent>
        <p>System vulnerability scanning results and mitigation advice will be available here.</p>
      </CardContent>
    </Card>
  );
}
