// src/app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';
import { TemplateProvider } from '@/context/TemplateContext';
import './globals.css'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TemplateProvider>
          {children}
          </TemplateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}