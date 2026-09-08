export const EMAIL = 'admin@redbarn.ventures'
export const SITE_URL = 'https://redbarn.ventures'
export const mailto = (subject: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`

export const CITIES = [
  { name: 'Ahmedabad', tz: 'Asia/Kolkata' },
  { name: 'Oslo', tz: 'Europe/Oslo' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'Amsterdam', tz: 'Europe/Amsterdam' },
]

export type Domain = { slug: string; name: string; tagline: string; intro: string; services: string[]; engage: string }
export const DOMAINS: Domain[] = [
  {
    slug: 'design', name: 'Design', tagline: 'Brands that look like they mean it.',
    intro: 'Identity, presentation and digital design that gives a company the confidence it deserves. We work from positioning outward, so every asset says the same thing in the same voice.',
    services: ['Brand identity & logo design', 'Brand guidelines & systems', 'Presentation & pitch decks', 'Web & product UI design', 'Marketing collateral', 'Packaging & print'],
    engage: 'Fixed-scope projects for identities and decks; ongoing design partnerships for teams shipping every week.',
  },
  {
    slug: 'technology', name: 'Technology', tagline: 'Software built to be owned, not rented.',
    intro: 'Websites, platforms and custom software engineered for the long term: clean architecture, clear documentation and a handover you can actually take in-house.',
    services: ['Website design & development', 'Custom software & platforms', 'Mobile applications', 'E-commerce & payments', 'Cloud, hosting & DevOps', 'Automation & AI integration'],
    engage: 'Discovery sprint first, then build in defined phases with a working release at the end of each.',
  },
  {
    slug: 'marketing', name: 'Marketing', tagline: 'Growth that compounds.',
    intro: 'Digital marketing that treats attention as an asset, not an expense. Strategy, search, paid and content tied to one measurable pipeline.',
    services: ['Digital marketing strategy', 'SEO & AI-search visibility', 'Paid media (Google, Meta, LinkedIn)', 'Content & social media', 'Email & CRM automation', 'Analytics & conversion optimisation'],
    engage: 'Monthly retainers with a shared dashboard; standalone audits and launch campaigns by scope.',
  },
  {
    slug: 'business', name: 'Business', tagline: 'Operations that scale without the chaos.',
    intro: 'Management consulting for companies that have outgrown how they were run. We bring Six Sigma discipline and operator experience to the processes that make or break growth.',
    services: ['Management & strategy consulting', 'Six Sigma & process excellence', 'Operations & supply chain', 'Market research & market entry', 'Business planning & modelling', 'Project & change management'],
    engage: 'Diagnostic first, always. Then a defined improvement programme with targets we sign up to.',
  },
  {
    slug: 'finance', name: 'Finance', tagline: 'Numbers you can make decisions on.',
    intro: 'Accounting, reporting and financial planning for founders who want clean books, honest forecasts and a business that is ready when investors or buyers look closely.',
    services: ['Accounting & bookkeeping', 'Tax planning & compliance', 'Financial reporting', 'Budgeting & forecasting', 'Fundraising & investor readiness', 'Valuation & due diligence'],
    engage: 'Monthly finance partnerships for growing companies; project engagements for raises, valuations and diligence.',
  },
]

export const STAGES = [
  { slug: 'pre-seed', name: 'Pre-seed & Seed', desc: 'The first cheque, often before the product is finished. We back founders on the strength of the problem, the insight and the team, and we roll up our sleeves alongside the capital.' },
  { slug: 'series-a', name: 'Series A & B', desc: 'Companies with real customers and a repeatable motion that now need capital and operating support to build the machine around it.' },
  { slug: 'growth', name: 'Growth & Expansion', desc: 'Proven businesses entering new markets, categories or geographies. We bring capital and the consultancy bench to make expansion controlled rather than hopeful.' },
  { slug: 'strategic', name: 'Strategic & Late stage', desc: 'Long-term positions in companies we intend to hold. Ownership, not a trade: we invest where we can add value for years, not quarters.' },
]

export type Industry = { slug: string; name: string; desc: string; services: string[] }
export const INDUSTRIES: Industry[] = [
  { slug: 'technology-saas', name: 'Technology & SaaS', desc: 'Product-led software companies, from first release to scaled platforms. Positioning, growth engines, engineering partnerships and investment across the lifecycle.', services: ['Technology', 'Marketing', 'Investment'] },
  { slug: 'fintech', name: 'Fintech', desc: 'Payments, lending, wealth and infrastructure businesses where trust, compliance and unit economics have to be right from day one.', services: ['Finance', 'Technology', 'Business'] },
  { slug: 'healthcare', name: 'Healthcare & Life Sciences', desc: 'Clinics, health-tech and services companies operating under real regulatory weight, where process discipline and clear communication matter.', services: ['Business', 'Design', 'Finance'] },
  { slug: 'consumer-retail', name: 'Consumer & Retail', desc: 'Brands and retailers competing on identity, experience and margin. Brand building, e-commerce and marketing that pays for itself.', services: ['Design', 'Marketing', 'Technology'] },
  { slug: 'energy-climate', name: 'Energy & Climate', desc: 'Renewables, storage, efficiency and the companies enabling them. Long-horizon businesses that suit long-horizon capital.', services: ['Investment', 'Business', 'Finance'] },
  { slug: 'media-entertainment', name: 'Media & Entertainment', desc: 'Studios, platforms and creator businesses where audience, brand and distribution are the whole game.', services: ['Marketing', 'Design', 'Technology'] },
  { slug: 'real-estate', name: 'Real Estate', desc: 'Developers, operators and proptech. Financial modelling, presentation and the operating rigour that lenders and partners expect.', services: ['Finance', 'Business', 'Design'] },
  { slug: 'industrial', name: 'Industrial & Manufacturing', desc: 'Manufacturers and industrial services where Six Sigma, supply chain and digitisation turn directly into margin.', services: ['Business', 'Technology', 'Finance'] },
]

export type Role = { title: string; team: string; location: string; desc: string }
export const ROLES: Role[] = [
  { title: 'Brand & Presentation Designer', team: 'Design', location: 'Ahmedabad / Remote', desc: 'Identities, decks and design systems for clients and portfolio companies. Strong typography and an eye for what makes a brand feel established.' },
  { title: 'Full-stack Engineer', team: 'Technology', location: 'Remote (Europe / India)', desc: 'React, TypeScript and Node across client platforms and our own products. You care about clean architecture and shipping working software often.' },
  { title: 'Growth Marketing Lead', team: 'Marketing', location: 'London / Remote', desc: 'Own search, paid and content for a portfolio of companies. Comfortable with numbers, ruthless about what actually moves pipeline.' },
  { title: 'Business Consultant, Process & Operations', team: 'Business', location: 'Amsterdam / Oslo', desc: 'Lead diagnostics and Six Sigma improvement programmes with growing companies. Operator experience preferred over slideware.' },
  { title: 'Finance Associate', team: 'Finance', location: 'Ahmedabad', desc: 'Bookkeeping, reporting and forecasting for clients across four countries. Precise, curious and unafraid of a messy ledger.' },
]

export const VALUES = [
  { name: 'Ownership', desc: 'We act like owners because we often are. Long-term thinking beats a quick win, every time.' },
  { name: 'Craft', desc: 'The deck, the code, the ledger: whatever we touch should be something we would sign our name to.' },
  { name: 'Candour', desc: 'We tell clients and founders what we actually think, early, even when it is not what they hoped to hear.' },
  { name: 'Range', desc: 'Design, technology, marketing, business and finance under one roof, so problems get solved whole.' },
]
