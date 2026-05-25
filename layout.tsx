import './globals.css'

export const metadata = {
  title: 'Syncra AI',
  description: 'Never lose a customer again.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}