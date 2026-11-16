import type { Metadata } from 'next'
import { Cairo, Geist_Mono } from 'next/font/google'
import { defaultLocale, getDirection } from '@/lib/locale'
import AppProvidersWrapper from '@/components/wrappers/AppProvidersWrapper'
import './globals.css'
import { PreviewNotice } from '@/components/brand/PreviewNotice'
import { LOCAL_PREVIEW } from '@/lib/preview/catalog'

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'الجودي | معك… حتى القمة',
  description: 'منصة الجودي للتوجيهي الفلسطيني. استكشف المواد والمدرسين، رتّب دراستك، وتابع تقدّمك خطوة خطوة.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = defaultLocale

  return (
    <html lang={locale} dir={getDirection(locale)} className={`${cairo.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Every Turbopack chunk starts with `globalThis.TURBOPACK`; iOS 12.0/12.1 Safari lacks globalThis. */}
        <script dangerouslySetInnerHTML={{ __html: 'window.globalThis||(window.globalThis=window);' }} />
      </head>
      <body className="min-h-full font-sans" data-local-preview={LOCAL_PREVIEW ? 'true' : undefined}>
        <PreviewNotice />
        <AppProvidersWrapper>{children}</AppProvidersWrapper>
      </body>
    </html>
  )
}
