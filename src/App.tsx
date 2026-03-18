import { FloatingControls } from "./components/FloatingControls";
import { LanguageProvider } from "./hooks/language";
import { ThemeProvider } from "./hooks/theme";
import { EventDetails } from "./sections/EventDetails";
import { Footer } from "./sections/Footer";
import { HeroSection } from "./sections/HeroSection";
import { RSVPSection } from "./sections/RSVPSection";

export default function App() {

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="font-sans antialiased selection:bg-[#FF66B2]/30">
          <FloatingControls />
          <HeroSection />
          <EventDetails />
          <RSVPSection />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
