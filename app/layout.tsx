import ReduxProvider from "@/app/store/provider";
import "./globals.css";
import "./nexus-token.css"; // ← naam check kar lein, file jo actually save ki hai wahi likhein

import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {children}
          </div>
          <Toaster richColors position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}