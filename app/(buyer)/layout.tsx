import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/components/ai/ChatWidget';
import { ComparisonTray } from '@/components/ai/ComparisonTray';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ComparisonTray />
      <ChatWidget />
    </div>
  );
}
