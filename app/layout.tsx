import type { Metadata } from 'next'
import './globals.css'
import Head from 'next/head'

export const metadata: Metadata = {
  title: 'NinjaJS - Online JavaScript Editor',
  description: 'NinjaJS is an online JavaScript editor that allows you to write, run, and share your code in real-time.',
  assets: ["favicon.ico"],
  applicationName: 'NinjaJS',
  creator: 'NinjaJS',
  twitter: {
    card: 'summary',
    site: '@ninja_js',
    creator: '@ninja_js',
    images: ['/android-chrome-512x512.png'],
  },
  authors: {
    name: 'Andre Ponce',
    url: 'https://andrepg.me'
  },
  keywords: ['ninja', 'js', 'javascript', 'editor', 'code', 'online', 'real-time'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </>
      </Head>
      <body className={'font-dejavusans'}>{children}</body>
    </html>
  )
}
