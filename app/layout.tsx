import ReduxProvider from "@/app/store/provider";
import "./globals.css";
import "./nexus-token.css";
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