import { EMAIL, CITIES } from '../content/site'
import { PageHero, usePageMeta } from '../components/Blocks'
import Footer from '../components/Footer'

type Sec = { h: string; p?: string[]; ul?: string[] }
const updated = '8 September 2026'

const PRIVACY: Sec[] = [
  { h: 'Who we are', p: [`Redbarn Ventures ("Redbarn", "we", "us") provides consultancy and investment services and operates across ${CITIES.map((c) => c.name).join(', ')}. This policy explains what personal data we collect through this website, why, and the rights you have over it. Questions go to ${EMAIL}.`] },
  { h: 'What we collect', ul: ['Contact form: your name, email address, company or project, the topic you select and the message you write.', 'Email: anything you send to our addresses, including attachments such as decks or CVs.', 'Technical data: our hosting provider (Cloudflare) processes IP addresses and request logs to serve and secure the site. We do not run analytics or advertising trackers on this site.'] },
  { h: 'Why we use it', ul: ['To reply to your enquiry and, if appropriate, to discuss working together.', 'To evaluate pitches, proposals and applications you send us.', 'To keep the website secure and available.'], p: ['Our legal bases under the GDPR and UK GDPR are your consent (when you contact us), our legitimate interests in responding to enquiries and running our business, and, where we go on to work together, performance of a contract.'] },
  { h: 'How long we keep it', p: ['Enquiries and correspondence are kept for as long as needed to deal with them and for up to three years afterwards, unless a longer period is required by law or we enter into a business relationship. Applications are kept for up to twelve months unless you ask us to delete them sooner.'] },
  { h: 'Who we share it with', p: ['We do not sell personal data. We share it only with service providers who help us operate, such as email and hosting providers, and only as needed to provide those services. Where data leaves the EEA or UK, we rely on appropriate safeguards such as standard contractual clauses.'] },
  { h: 'Your rights', ul: ['Access the personal data we hold about you.', 'Ask us to correct or delete it.', 'Object to or restrict how we use it.', 'Receive a copy in a portable format.', 'Withdraw consent at any time, where consent is the basis.'], p: [`To exercise any of these, email ${EMAIL}. You also have the right to complain to your local data protection authority.`] },
  { h: 'Changes', p: [`We may update this policy from time to time. The current version is always at redbarn.ventures/privacy. Last updated ${updated}.`] },
]

const TERMS: Sec[] = [
  { h: 'Using this website', p: ['By using redbarn.ventures you agree to these terms. If you do not agree, please do not use the site. The site is provided for general information about Redbarn Ventures and its services.'] },
  { h: 'No advice', p: ['Content on this site, including articles in Insights, is general information and opinion. It is not financial, investment, legal, tax or professional advice, and it is not an offer or solicitation to invest. Any engagement with Redbarn is governed by a separate written agreement.'] },
  { h: 'Intellectual property', p: ['Unless stated otherwise, the text, design, graphics and code on this site belong to Redbarn Ventures. You may share links to our pages and quote short extracts with attribution. You may not reproduce substantial parts of the site without our written permission.'] },
  { h: 'Submissions', p: ['Anything you send us through the site or by email, including pitches and applications, is sent on a non-confidential basis unless we have agreed otherwise in writing. Please do not send information you consider confidential until a non-disclosure agreement is in place.'] },
  { h: 'Availability and accuracy', p: ['We aim to keep the site accurate and available but we do not guarantee either. We may change or remove content at any time. Links to third-party sites are provided for convenience and we are not responsible for their content.'] },
  { h: 'Liability', p: ['To the fullest extent permitted by law, Redbarn Ventures excludes liability for any loss arising from use of, or reliance on, this website. Nothing in these terms limits liability that cannot be limited by law.'] },
  { h: 'Governing law', p: [`These terms are governed by the laws of the jurisdiction in which the relevant Redbarn entity is established. Contact ${EMAIL} with any questions. Last updated ${updated}.`] },
]

const COOKIES: Sec[] = [
  { h: 'The short version', p: ['This website does not use advertising, analytics or tracking cookies. That is why you do not see a cookie banner.'] },
  { h: 'What is set', ul: ['Strictly necessary: our hosting provider, Cloudflare, may set a small number of technical cookies to keep the site secure and performing (for example, bot protection). These do not identify you and cannot be switched off without affecting the site.', 'Fonts: web fonts are loaded from Google Fonts. Google may log the request as part of serving the font file.'] },
  { h: 'If this changes', p: ['If we ever add analytics or marketing tools, we will update this page first and ask for your consent where the law requires it.'] },
  { h: 'Managing cookies', p: [`You can block or delete cookies in your browser settings at any time. Questions to ${EMAIL}. Last updated ${updated}.`] },
]

function LegalPage({ label, title, sections, meta, path }: { label: string; title: string; sections: Sec[]; meta: string; path: string }) {
  usePageMeta(title, meta, path)
  return (
    <div className="pg">
      <PageHero label={label} title={title}><p>Last updated {updated}.</p></PageHero>
      <div className="legal">
        {sections.map((s) => (
          <section key={s.h}><h2>{s.h}</h2>{s.p?.map((p, i) => <p key={i}>{p}</p>)}{s.ul && <ul>{s.ul.map((li) => <li key={li}>{li}</li>)}</ul>}</section>
        ))}
      </div>
      <Footer />
    </div>
  )
}

export const Privacy = () => <LegalPage label="/ Legal" title="Privacy policy" sections={PRIVACY} meta="How Redbarn Ventures collects, uses and protects personal data on redbarn.ventures." path="/privacy" />
export const Terms = () => <LegalPage label="/ Legal" title="Terms of use" sections={TERMS} meta="Terms of use for the Redbarn Ventures website." path="/terms" />
export const Cookies = () => <LegalPage label="/ Legal" title="Cookie policy" sections={COOKIES} meta="Cookie policy for redbarn.ventures. No advertising, analytics or tracking cookies are used." path="/cookies" />
