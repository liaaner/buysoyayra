import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StoreProvider } from "@/contexts/StoreContext";
import ChatWidget from "@/components/ChatWidget";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <Navbar />
      {children}
      <Footer />
      <ChatWidget />
    </StoreProvider>
  );
}
