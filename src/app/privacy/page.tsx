
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-24 px-6">
        <div className="max-w-4xl w-full mx-auto">
            <Card>
            <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Our Privacy Policy will be detailed here.</p>
            </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
