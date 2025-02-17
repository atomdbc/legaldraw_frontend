import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Metadata } from 'next'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Docwelo | AI-Powered Document Platform',
    template: '%s | Docwelo'
  },
  description: 'Transform your document creation process with Docwelo. AI-powered platform for flawless documents in minutes. Save time, reduce stress, and ensure perfection.',
  keywords: [
    'document generation',
    'AI documents',
    'legal documents',
    'document automation',
    'document management',
    'professional documents',
    'time-saving documents',
    'document platform'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docwelo.com',
    title: 'Docwelo | AI-Powered Document Platform',
    description: 'Transform your document creation process with Docwelo. Create flawless documents in minutes, not hours.',
    siteName: 'Docwelo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11012304824');
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-11012304824"
          strategy="afterInteractive"
        />
        <TooltipProvider>
          <AuthProvider>
            <main>
              {children}
            </main>
            <Toaster /> {/* Add this line */}
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}