import Header from "./components/Header";
import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    
    <html lang="en">
      <body>
        <Header />
        {children}</body>
    </html>
  );
}
