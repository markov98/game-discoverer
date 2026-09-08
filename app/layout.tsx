import Header from "./components/Header";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GameDiscoverer | Find your next gaming adventure",
  description: "Discover your next gaming adventure with GameDiscoverer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    
    <html lang="en">
      <body>
        <Header />
        {children}</body>
    </html>
  );
}
