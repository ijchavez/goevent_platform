/* eslint-disable react/react-in-jsx-scope */
import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/Header'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
