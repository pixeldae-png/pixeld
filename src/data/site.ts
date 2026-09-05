export const site = {
  brand: 'PIXELD',
  name: 'Khalid Alketbi',
  roles: ['Website Designer', 'UI/UX Designer', 'Web Developer'],
  tagline: "Hi, I'm",
  heroSub:
    'I design and build modern digital experiences for brands that want to stand out.',
  wordmark: 'PIXELD',
  portrait: '/images/khalid-portrait-2.png',
  portraitAlt: '/images/khalid-portrait-1.png',

  nav: [
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ],

  about: {
    label: 'About Me',
    heading: "I'm Khalid, founder of PIXELD.",
    paragraphs: [
      'I design and build modern websites, online stores, dashboards, loyalty systems, and custom digital experiences for brands and businesses.',
      'I focus on clean design, strong user experience, smooth interactions, mobile performance, and websites that feel intentional rather than templated.',
    ],
  },

  stack: [
    'React',
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'GSAP',
    'Supabase',
    'Cloudflare',
    'Netlify',
    'Resend',
    'Ziina',
  ],

  services: [
    {
      n: '01',
      title: 'Website Design',
      body: 'Clean, considered layouts built around your brand and your visitors — not a template with your logo dropped in.',
    },
    {
      n: '02',
      title: 'Custom Website Development',
      body: 'Hand-built front and back ends, no page-builder bloat, tuned for speed and easy to extend later.',
    },
    {
      n: '03',
      title: 'E-commerce Development',
      body: 'Full online stores — catalog, cart, checkout, and payments — built to convert and easy for you to manage.',
    },
    {
      n: '04',
      title: 'UI/UX Design',
      body: 'Interfaces that are mapped out before a single pixel is placed, so every screen earns its spot.',
    },
    {
      n: '05',
      title: 'Admin Dashboards',
      body: 'Internal tools and dashboards that make it simple to manage orders, content, and data without touching code.',
    },
    {
      n: '06',
      title: 'Payment Integration',
      body: 'Secure, reliable checkout flows wired up to the payment providers your business already trusts.',
    },
    {
      n: '07',
      title: 'Website Animations',
      body: 'Scroll-driven motion and micro-interactions that add polish without slowing the page down.',
    },
    {
      n: '08',
      title: 'Digital Brand Experiences',
      body: 'End-to-end digital experiences that tie design, content, and interaction into one coherent brand feel.',
    },
  ],

  pricing: {
    currency: 'AED',
    plans: [
      {
        name: 'Starter Website',
        price: '800',
        note: 'From',
        features: [
          'Up to 5 pages',
          'Responsive design',
          'Basic SEO setup',
          'Contact form',
          '2 rounds of revisions',
        ],
        cta: 'Get Started',
        highlighted: false,
      },
      {
        name: 'Advanced Store',
        price: '1,100',
        note: 'From',
        features: [
          'Everything in Starter',
          'Online store with cart & checkout',
          'Product & category management',
          'Payment integration',
          'Admin dashboard access',
        ],
        cta: 'Get Started',
        highlighted: true,
      },
      {
        name: 'Complete Store',
        price: '1,400',
        note: 'From',
        features: [
          'Everything in Advanced',
          'Custom admin tooling',
          'Loyalty / rewards system',
          'Advanced animations',
          'Priority support',
        ],
        cta: 'Get Started',
        highlighted: false,
      },
    ],
    footnote: 'Need something more? We craft custom plans to fit your needs.',
  },

  contact: {
    email: 'hello@pixeld.studio',
    fields: ['Name', 'Email', 'Phone', 'Business Name', 'Message'],
  },

  socials: [
    { label: 'Instagram', href: '#' },
    { label: 'X', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],

  stats: [
    { value: '2+', label: 'Years building' },
    { value: '20+', label: 'Projects shipped' },
    { value: '100%', label: 'Client-owned code' },
  ],

  footer: {
    tagline: 'Modern websites and digital experiences built with intention.',
  },
} as const

export type SiteConfig = typeof site
