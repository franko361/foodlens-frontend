import { Geist, Geist_Mono, Playfair_Display, Lora, Nunito, Montserrat } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/lib/AccessibilityContext";
import { SuspendedModal } from '@/components/SuspendedModal'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], preload: false });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], preload: false });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], preload: false });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], preload: false });

export const metadata = {
  title: "FoodLens",
  description: "Menú digital con IA y realidad aumentada",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${lora.variable} ${nunito.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AccessibilityProvider>
          {children}
          <SuspendedModal />
        </AccessibilityProvider>
      </body>
    </html>
  );
}