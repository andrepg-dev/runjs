import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NinjaJS - Online JavaScript Editor',
  description: 'NinjaJS is an online JavaScript editor that allows you to write, run, and share your code in real-time.',
  assets: ["favicon.ico", "/icon-512x512.png"],
  applicationName: 'NinjaJS',
  creator: 'NinjaJS',
  authors: {
    name: 'Andre Ponce',
    url: 'https://andrepg.me'
  },
  keywords: ['ninja', 'js', 'javascript', 'editor', 'code', 'online', 'real-time'],
  manifest: '/manifest.json',
  icons: {
    apple: "/icon-512x512.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={'font-dejavusans'}>{children}</body>
    </html>
  )
}
