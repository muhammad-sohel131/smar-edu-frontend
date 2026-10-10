import "./globals.css";
import RootProvider from "@/providers/RootProvider";

export const metadata = {
  title: "SMARTEDU HUB - Integrated LMS, Events & Donations",
  description: "An integrated platform for learning management, event organization, and donations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}