import Link from 'next/link';
import { Github, Globe, Linkedin, Mail } from 'lucide-react';
import { Logo } from './Logo';
import { ROUTES } from '@/constants';

const footerCategories = [
  { slug: 'cotton', name: 'Cotton' },
  { slug: 'silk', name: 'Silk' },
  { slug: 'linen', name: 'Linen' },
  { slug: 'denim', name: 'Denim' },
  { slug: 'wool', name: 'Wool & Suiting' },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-muted/30">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-16">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">
            An AI-native B2B textile marketplace connecting apparel brands with verified mills and
            fabric suppliers.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Categories</h3>
          <ul className="mt-4 space-y-2.5">
            {footerCategories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={ROUTES.CATEGORY(cat.slug)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Platform</h3>
          <ul className="mt-4 space-y-2.5">
            {[
              { href: ROUTES.PRODUCTS, label: 'Marketplace' },
              { href: ROUTES.BUYER_DASHBOARD, label: 'Buyer dashboard' },
              { href: ROUTES.SUPPLIER_DASHBOARD, label: 'Supplier dashboard' },
              { href: ROUTES.REGISTER, label: 'Create account' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Developer</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href="https://abrarali.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Abrarali Sunasara's Portfolio"
              >
                <Globe className="mr-2 h-4 w-4" aria-hidden="true" />
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="https://github.com/abraralis"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Abrarali Sunasara's GitHub Profile"
              >
                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/abraralis"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Abrarali Sunasara's LinkedIn Profile"
              >
                <Linkedin className="mr-2 h-4 w-4" aria-hidden="true" />
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="mailto:abrarali.sunasara28@gmail.com"
                className="flex w-fit items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Email Abrarali Sunasara"
              >
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                Email
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-page border-t py-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Texora. Built by Abrarali Sunasara. Demo marketplace built for a hackathon — data shown is illustrative.
        </p>
      </div>
    </footer>
  );
}
