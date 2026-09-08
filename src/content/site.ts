export const EMAIL = 'admin@redbarn.ventures'
export const SITE_URL = 'https://redbarn.ventures'
export const mailto = (subject: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`

export const CITIES = [
  { name: 'Ahmedabad', tz: 'Asia/Kolkata' },
  { name: 'Oslo', tz: 'Europe/Oslo' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'Amsterdam', tz: 'Europe/Amsterdam' },
]

export type Step = { h: string; p: string }
export type Service = { name: string; desc: string }
export type Domain = { slug: string; name: string; tagline: string; intro: string; long: string[]; services: Service[]; forWho: string[]; process: Step[]; engage: string; article: string }

export const DOMAINS: Domain[] = [
  {
    slug: 'design', name: 'Design', tagline: 'Brands that look like they mean it.',
    intro: 'Identity, presentation and digital design that gives a company the confidence it deserves. We work from positioning outward, so every asset says the same thing in the same voice.',
    long: [
      'Design is the first thing a customer, investor or hire judges you on, and they judge fast. A brand that looks improvised reads as a company that has not decided what it is. A brand that looks settled buys you trust before anyone has read a word.',
      'We start with the positioning sentence, not the logo. Once that is right, the identity, the deck, the website and the collateral all fall out of the same decision, and they stay consistent when you are not in the room. Because our engineers, marketers and finance team sit next to the designers, a new identity can ship with its website and its investor deck on the same day.',
    ],
    services: [
      { name: 'Brand identity & logo design', desc: 'A mark, wordmark and visual language built from your positioning, delivered in every format you will ever need.' },
      { name: 'Brand guidelines & systems', desc: 'The rules that keep the brand consistent when you are not in the room: type, colour, layout and tone of voice.' },
      { name: 'Presentation & pitch decks', desc: 'Investor, sales and board decks designed to be read in ninety seconds and remembered for a week.' },
      { name: 'Web & product UI design', desc: 'Websites and product interfaces designed around the user, then handed straight to our own engineers.' },
      { name: 'Marketing collateral', desc: 'One-pagers, case studies, ads and social templates that look like they came from the same company.' },
      { name: 'Packaging & print', desc: 'Physical touchpoints from packaging to signage, with print production managed end to end.' },
    ],
    forWho: ['Founders about to raise who need a deck and identity that match the ambition', 'Established companies whose brand no longer reflects what they have become', 'Product teams that need a design partner who can also build'],
    process: [
      { h: 'Position', p: 'One sentence: who it is for, what it does, why it is different. Everything is built on this.' },
      { h: 'Explore', p: 'Two or three genuinely different directions, shown in real contexts, not on a blank canvas.' },
      { h: 'Refine', p: 'One direction, pushed until it holds at every size and in every format.' },
      { h: 'Deliver', p: 'Files, guidelines, templates, and a handover so your team can use it without us.' },
    ],
    engage: 'Fixed-scope projects for identities and decks; ongoing design partnerships for teams shipping every week.',
    article: 'brand-identity-on-a-startup-budget',
  },
  {
    slug: 'technology', name: 'Technology', tagline: 'Software built to be owned, not rented.',
    intro: 'Websites, platforms and custom software engineered for the long term: clean architecture, clear documentation and a handover you can actually take in-house.',
    long: [
      'Most software problems are not technical. They are decisions made in a hurry by people who will not be around to live with them. We build as if we will inherit the code, because as owners of companies, we often do.',
      'That means modern, boring-in-the-right-places stacks, documentation written as part of the work rather than at the end, and accounts, repositories and infrastructure that belong to you from the first commit. Discovery comes first, then we build in phases that each end with something working in production.',
    ],
    services: [
      { name: 'Website design & development', desc: 'Fast, accessible, easy-to-edit websites on modern stacks, built to rank and to convert.' },
      { name: 'Custom software & platforms', desc: 'Internal tools, portals and platforms engineered around your process, not the other way round.' },
      { name: 'Mobile applications', desc: 'iOS and Android apps, native or cross-platform, from prototype to store release.' },
      { name: 'E-commerce & payments', desc: 'Storefronts, checkout and payment integrations that are secure, quick and measurable.' },
      { name: 'Cloud, hosting & DevOps', desc: 'Infrastructure that scales, deploys automatically and does not wake you up at three in the morning.' },
      { name: 'Automation & AI integration', desc: 'Workflows, integrations and AI features that remove manual work and add real capability.' },
    ],
    forWho: ['Companies replacing a website or platform that has become a liability', 'Founders who need an MVP built by people who will still answer the phone in year two', 'Operators drowning in manual work that software should be doing'],
    process: [
      { h: 'Discover', p: 'Two to four weeks on users, constraints and what the software must do in a year. Stack decisions fall out of this.' },
      { h: 'Design', p: 'Architecture and interface together, so what gets built is what gets used.' },
      { h: 'Build in phases', p: 'Defined releases, each one working in production. No twelve-month reveal.' },
      { h: 'Launch and support', p: 'Documented, monitored, handed over. Ongoing support if you want it, independence if you do not.' },
    ],
    engage: 'Discovery sprint first, then build in defined phases with a working release at the end of each.',
    article: 'how-to-choose-a-software-development-partner',
  },
  {
    slug: 'marketing', name: 'Marketing', tagline: 'Growth that compounds.',
    intro: 'Digital marketing that treats attention as an asset, not an expense. Strategy, search, paid and content tied to one measurable pipeline.',
    long: [
      'Marketing budgets get wasted in two ways: activity without a plan, and plans without numbers. We fix both. Every engagement starts with a single pipeline model, so every channel is measured on the same thing: qualified demand, and what it cost.',
      'Search has changed. AI answers now sit above the results, and the clicks that used to be free are not. We build for the new engines, structured content that gets cited, and for the channels no algorithm can intermediate: email, community, brand. Paid media follows intent, not vanity reach.',
    ],
    services: [
      { name: 'Digital marketing strategy', desc: 'One plan, one pipeline, one set of numbers: what to do, in what order, and why.' },
      { name: 'SEO & AI-search visibility', desc: 'Ranking in search and getting cited in AI answers, with content that earns both.' },
      { name: 'Paid media (Google, Meta, LinkedIn)', desc: 'Campaigns run on intent and measured on pipeline, not on clicks.' },
      { name: 'Content & social media', desc: 'Content people actually read, and social channels that build an audience rather than fill a calendar.' },
      { name: 'Email & CRM automation', desc: 'Lifecycle email and CRM flows that turn a list into a revenue channel.' },
      { name: 'Analytics & conversion optimisation', desc: 'Tracking that tells the truth, and continuous testing that lifts conversion.' },
    ],
    forWho: ['Companies spending on marketing without a clear line to revenue', 'Founders launching a product who need the first thousand customers, not a logo refresh', 'Teams whose organic traffic has fallen since AI answers arrived'],
    process: [
      { h: 'Audit', p: 'Where the money goes now, what it returns, and what the data actually says.' },
      { h: 'Plan', p: 'Channels, sequence, budget and the pipeline model everything reports into.' },
      { h: 'Run', p: 'Monthly cycles: ship, measure, cut what fails, double what works.' },
      { h: 'Report', p: 'One dashboard, shared with you, showing pipeline and cost rather than impressions.' },
    ],
    engage: 'Monthly retainers with a shared dashboard; standalone audits and launch campaigns by scope.',
    article: 'digital-marketing-when-ai-answers-the-search',
  },
  {
    slug: 'business', name: 'Business', tagline: 'Operations that scale without the chaos.',
    intro: 'Management consulting for companies that have outgrown how they were run. We bring Six Sigma discipline and operator experience to the processes that make or break growth.',
    long: [
      'Every company reaches the point where the founder can no longer see everything, and the processes that worked at fifteen people start failing at fifty. Orders slip, cash arrives late, handoffs fall through the gaps, and nobody quite owns the problem. That is where we come in.',
      'We are operators first. We have run companies, and we own several. The consulting we do is built on Six Sigma discipline, define the defect, measure it, find the cause, fix it, keep it fixed, applied by people who know what it is like to be on the receiving end of a recommendation.',
    ],
    services: [
      { name: 'Management & strategy consulting', desc: 'Clear-eyed strategy for the next three years, and the operating plan to actually get there.' },
      { name: 'Six Sigma & process excellence', desc: 'DMAIC improvement programmes that cut defects, delays and cost from how work gets done.' },
      { name: 'Operations & supply chain', desc: 'Planning, procurement and logistics designed for reliability and margin.' },
      { name: 'Market research & market entry', desc: 'Evidence before commitment: sizing, competitors, customers and a route into a new market.' },
      { name: 'Business planning & modelling', desc: 'Plans and financial models built to be used, by you and by the people funding you.' },
      { name: 'Project & change management', desc: 'Getting large changes delivered on time, with the organisation still intact.' },
    ],
    forWho: ['Growing companies where quality, delivery or cash has become unpredictable', 'Leadership teams entering a new market or category', 'Businesses preparing for a sale, a raise or a major expansion'],
    process: [
      { h: 'Diagnose', p: 'A short, honest look at where value is being lost. Numbers, not opinions.' },
      { h: 'Design', p: 'The improvement programme: targets we sign up to, and the people who will own them.' },
      { h: 'Implement', p: 'Change delivered alongside your team, not handed to them in a deck.' },
      { h: 'Control', p: 'The fix built into routine, so it survives the next hire and the next quarter.' },
    ],
    engage: 'Diagnostic first, always. Then a defined improvement programme with targets we sign up to.',
    article: 'six-sigma-for-growing-companies',
  },
  {
    slug: 'finance', name: 'Finance', tagline: 'Numbers you can make decisions on.',
    intro: 'Accounting, reporting and financial planning for founders who want clean books, honest forecasts and a business that is ready when investors or buyers look closely.',
    long: [
      'Finance is where a company finds out whether it is really working. Most founders discover this the week before a fundraise, when a diligence request lands and eighteen months of receipts have to be reconstructed. We would rather you found out every month.',
      'We run finance the way an owner would want it run: a monthly close you can trust, reports that explain the business rather than just record it, and forecasts tied to the operating plan. When it is time to raise, sell or acquire, the data room is already built.',
    ],
    services: [
      { name: 'Accounting & bookkeeping', desc: 'Clean, current books with a monthly close you can rely on.' },
      { name: 'Tax planning & compliance', desc: 'Filings on time across the countries you operate in, structures that make sense, no surprises.' },
      { name: 'Financial reporting', desc: 'Management accounts and board reporting that explain the business, not just record it.' },
      { name: 'Budgeting & forecasting', desc: 'Rolling forecasts and budgets tied to the operating plan and revisited every month.' },
      { name: 'Fundraising & investor readiness', desc: 'Data rooms, models and narratives ready before investors ask for them.' },
      { name: 'Valuation & due diligence', desc: 'Independent valuations and diligence support for raises, sales and acquisitions.' },
    ],
    forWho: ['Founders who want to build the company rather than the spreadsheet', 'Companies operating across more than one country', 'Businesses preparing for investment, acquisition or exit'],
    process: [
      { h: 'Onboard', p: 'Clean-up, chart of accounts, systems and a calendar of every deadline you face.' },
      { h: 'Close', p: 'A reliable monthly close, with the three reports that matter read and explained.' },
      { h: 'Report', p: 'Management and board reporting that tells you what changed and why.' },
      { h: 'Plan', p: 'Forecasts, budgets and, when the time comes, the raise or the sale.' },
    ],
    engage: 'Monthly finance partnerships for growing companies; project engagements for raises, valuations and diligence.',
    article: 'accounting-basics-founders-year-one',
  },
]

export type Stage = { slug: string; name: string; desc: string; long: string[]; look: string[]; bring: Step[] }
export const STAGES: Stage[] = [
  {
    slug: 'pre-seed', name: 'Pre-seed & Seed', desc: 'The first cheque, often before the product is finished. We back founders on the strength of the problem, the insight and the team, and we roll up our sleeves alongside the capital.',
    long: [
      'At pre-seed there is rarely a product, and there is never a track record. What there is, in the companies we back, is a problem the founder understands better than anyone else in the room, a reason it can be solved now that did not exist three years ago, and a team that has already started without waiting for permission.',
      'This is where our model matters most. A first cheque from Redbarn arrives with a deck the founder is proud of, a brand that looks settled, an MVP built by engineers who will still be there in year two, and a finance function that means the next raise is not a scramble.',
    ],
    look: ['A problem you have lived, not one you found in a report', 'An insight about why now: a cost curve, a regulation, a behaviour that shifted', 'Founders who know their numbers and their weaknesses', 'Early signal: users, letters of intent, a waiting list, anything real'],
    bring: [
      { h: 'Design', p: 'The identity and the investor deck, built from your positioning, ready for the next round.' },
      { h: 'Technology', p: 'An MVP engineered to survive contact with real customers and to grow, not to be thrown away.' },
      { h: 'Finance', p: 'A model that holds up to scrutiny and books that are investor-ready from month one.' },
      { h: 'Marketing', p: 'The first customers: a launch plan and the channels to reach them.' },
    ],
  },
  {
    slug: 'series-a', name: 'Series A & B', desc: 'Companies with real customers and a repeatable motion that now need capital and operating support to build the machine around it.',
    long: [
      'By Series A the question has changed from "does anyone want this" to "can this be repeated, profitably, by people other than the founder". The companies that struggle here are not short of demand. They are short of process, reporting and the operating layer that turns a great product into a great business.',
      'We invest at A and B where the repeatable motion is visible and the gap is operational. Our capital comes with the business and finance teams who have built that layer before: sales and delivery processes, management reporting, and the marketing engine that scales without the cost per customer running away.',
    ],
    look: ['A repeatable sales or acquisition motion with evidence, not anecdotes', 'Retention that says customers stay because it works, not because switching hurts', 'Unit economics that improve with scale', 'A founder ready to build an organisation, not just a product'],
    bring: [
      { h: 'Business', p: 'Process design and Six Sigma discipline for the parts of the company that are starting to strain.' },
      { h: 'Finance', p: 'Board-grade reporting, forecasting and the data room for the next round.' },
      { h: 'Marketing', p: 'Scaling demand generation on pipeline economics, not impressions.' },
      { h: 'Technology', p: 'Platform hardening, automation and the tooling a bigger team needs.' },
    ],
  },
  {
    slug: 'growth', name: 'Growth & Expansion', desc: 'Proven businesses entering new markets, categories or geographies. We bring capital and the consultancy bench to make expansion controlled rather than hopeful.',
    long: [
      'Expansion is where good companies lose money fastest. A model that works in one market is assumed to work in the next, a launch is planned on optimism, and the operating discipline that got the company here is stretched across two geographies at once.',
      'We back growth-stage expansion with capital and, just as importantly, with the research, modelling and market-entry experience to make it deliberate. Working across four countries ourselves, we know what changes when a business crosses a border, and what does not.',
    ],
    look: ['A proven model with clear evidence of what made it work', 'An expansion thesis grounded in research, not ambition alone', 'Leadership with the depth to run two things at once', 'Capital efficiency: growth that pays for itself within a horizon we can see'],
    bring: [
      { h: 'Business', p: 'Market research, entry strategy and the operating plan for the new territory or category.' },
      { h: 'Finance', p: 'Expansion modelling, multi-country compliance and reporting that keeps both businesses honest.' },
      { h: 'Marketing', p: 'Localised demand generation and brand positioning for a market that has never heard of you.' },
      { h: 'Technology', p: 'Platform and infrastructure that scale across regions, currencies and regulation.' },
    ],
  },
  {
    slug: 'strategic', name: 'Strategic & Late stage', desc: 'Long-term positions in companies we intend to hold. Ownership, not a trade: we invest where we can add value for years, not quarters.',
    long: [
      'Most capital at this stage is looking for an exit. We are looking for companies we would be happy to own for a decade: durable cash flows, a defensible position in a category that will still exist, and leadership we trust. Sometimes that means a significant minority position. Sometimes it means buying the company outright and running it.',
      'This is the ownership pillar of Redbarn. We bring patient capital, governance that helps rather than hinders, and the full consultancy bench applied not as a supplier but as a co-owner with the same incentives you have.',
    ],
    look: ['Durable, cash-generative businesses with a reason to exist in ten years', 'A category position that is hard to displace', 'Founders or leaders who want a long-term partner, not a countdown to exit', 'Operational upside we can help unlock as owners'],
    bring: [
      { h: 'Ownership', p: 'Patient capital and a governance model built for the long game.' },
      { h: 'Business', p: 'Continuous operational improvement, applied with an owner\u2019s incentives.' },
      { h: 'Finance', p: 'Institutional-grade reporting, planning and capital allocation.' },
      { h: 'Design & Marketing', p: 'Brand and demand kept sharp for as long as we hold the position.' },
    ],
  },
]

export type Industry = { slug: string; name: string; desc: string; long: string; challenges: string[]; help: string; services: string[] }
export const INDUSTRIES: Industry[] = [
  { slug: 'technology-saas', name: 'Technology & SaaS', desc: 'Product-led software companies, from first release to scaled platforms. Positioning, growth engines, engineering partnerships and investment across the lifecycle.',
    long: 'Software companies live and die on three things: whether the product is genuinely wanted, whether it can be sold repeatably, and whether the company behind it can operate at the scale the market allows. We work on all three, and we invest in the ones that get them right.',
    challenges: ['Standing out in a category where every competitor claims the same three benefits', 'Acquisition costs that rise faster than lifetime value as the easy channels saturate', 'Engineering, sales and finance pulling in different directions as the team passes fifty'],
    help: 'Positioning and brand that make the product legible, marketing built on pipeline economics, engineering partnerships for the platform, and finance that keeps the metrics honest. For the best of them, capital from pre-seed to growth.',
    services: ['Technology', 'Marketing', 'Design', 'Investment'] },
  { slug: 'fintech', name: 'Fintech', desc: 'Payments, lending, wealth and infrastructure businesses where trust, compliance and unit economics have to be right from day one.',
    long: 'Financial services companies do not get a second chance at trust. Regulation, security and unit economics have to be designed in from the start, and the brand has to communicate stability to customers who are handing over their money. We have run the numbers and the compliance across four countries.',
    challenges: ['Regulatory requirements that differ by market and change without notice', 'Building customer trust before there is a track record to point to', 'Margins that only work at scale, and a scale that only comes with trust'],
    help: 'Finance and compliance structures that survive scrutiny, secure platform engineering, and brand and marketing that signal stability. Business consulting for the operational discipline regulators expect to see.',
    services: ['Finance', 'Technology', 'Business', 'Design'] },
  { slug: 'healthcare', name: 'Healthcare & Life Sciences', desc: 'Clinics, health-tech and services companies operating under real regulatory weight, where process discipline and clear communication matter.',
    long: 'Healthcare businesses operate where a process failure is not a lost sale but a harmed patient. Process discipline is not optional, communication has to be clear to people under stress, and the numbers have to work in a system that rarely pays quickly.',
    challenges: ['Operational consistency across clinicians, sites and shifts', 'Communicating complex services to patients, referrers and payers in plain language', 'Cash flow in a sector where payment cycles are long and regulated'],
    help: 'Six Sigma process programmes designed for clinical and service environments, brand and communication that patients understand, and finance built for long payment cycles.',
    services: ['Business', 'Design', 'Finance', 'Technology'] },
  { slug: 'consumer-retail', name: 'Consumer & Retail', desc: 'Brands and retailers competing on identity, experience and margin. Brand building, e-commerce and marketing that pays for itself.',
    long: 'Consumer businesses win on brand, experience and margin, in that order and all at once. A great product with a forgettable identity loses to a good product with a great one, and both lose to whoever understands their unit economics best.',
    challenges: ['Building a brand that customers remember in a market full of noise', 'E-commerce and retail operations that protect margin as volume grows', 'Marketing spend that has to prove itself against tight margins'],
    help: 'Brand identity and packaging, e-commerce platforms built for conversion and margin, and marketing measured on contribution rather than reach.',
    services: ['Design', 'Marketing', 'Technology', 'Business'] },
  { slug: 'energy-climate', name: 'Energy & Climate', desc: 'Renewables, storage, efficiency and the companies enabling them. Long-horizon businesses that suit long-horizon capital.',
    long: 'Energy and climate companies are built on long horizons: multi-year projects, capital-intensive assets and returns measured in decades. They suit patient owners, and they need financial modelling, operational rigour and communication that turns technical work into something investors and customers can back.',
    challenges: ['Capital intensity and financing structures that need to be right from the first project', 'Translating engineering credibility into commercial and investor confidence', 'Operating discipline across projects, sites and suppliers'],
    help: 'Long-horizon capital, financial modelling and reporting for asset-heavy businesses, business consulting for project and supply-chain discipline, and brand that makes technical companies legible.',
    services: ['Investment', 'Finance', 'Business', 'Design'] },
  { slug: 'media-entertainment', name: 'Media & Entertainment', desc: 'Studios, platforms and creator businesses where audience, brand and distribution are the whole game.',
    long: 'Media businesses are distribution businesses. Audience is the asset, brand is how it is kept, and the platform underneath decides whether either can be monetised. We help media and entertainment companies own their audience rather than rent it from an algorithm.',
    challenges: ['Dependence on platforms that change the rules without warning', 'Turning attention into revenue without exhausting the audience', 'Technology that has to scale with a hit and shrink after it'],
    help: 'Audience and channel strategy, brand and design that hold an audience, owned platforms and e-commerce, and finance for businesses with lumpy revenue.',
    services: ['Marketing', 'Design', 'Technology', 'Finance'] },
  { slug: 'real-estate', name: 'Real Estate', desc: 'Developers, operators and proptech. Financial modelling, presentation and the operating rigour that lenders and partners expect.',
    long: 'Real estate runs on capital, credibility and execution. Lenders and partners want models they can trust and presentations that show a team in control; operators need processes that keep projects on time and assets performing. We bring all of it, and we hold property-related positions ourselves.',
    challenges: ['Financial models and presentations that satisfy lenders and investors', 'Project delivery and asset operations that stay on schedule and on margin', 'Technology and marketing that reach buyers and tenants efficiently'],
    help: 'Financial modelling, valuation and investor materials, business consulting for project and asset operations, brand and presentation for developments, and digital marketing for sales and leasing.',
    services: ['Finance', 'Business', 'Design', 'Marketing'] },
  { slug: 'industrial', name: 'Industrial & Manufacturing', desc: 'Manufacturers and industrial services where Six Sigma, supply chain and digitisation turn directly into margin.',
    long: 'Manufacturing is where Six Sigma was born, and it is still where it pays back fastest. Defects, downtime and supply-chain variability go straight to the bottom line, and the companies that measure and fix them systematically outcompete the ones that fight fires.',
    challenges: ['Quality and delivery variation that erodes margin and customer trust', 'Supply chains exposed to cost and availability shocks', 'Digitisation of processes that still run on paper and experience'],
    help: 'Six Sigma and process excellence programmes, supply-chain and operations consulting, software and automation for the shop floor and the office, and finance that shows where the margin really is.',
    services: ['Business', 'Technology', 'Finance', 'Investment'] },
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

export const domainPath = (name: string) => { const d = DOMAINS.find((x) => x.name === name); return d ? `/consultancy/${d.slug}` : '/investment' }
