import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/">
          <Image
            src="/assets/images/OIG4.jpg"
            width={128}
            height={38}
            alt="goEvent-logo"
          />
        </Link>
        <p>© 2024 goEvent. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
