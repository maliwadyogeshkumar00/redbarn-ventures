import { ROLES, VALUES, CITIES, mailto } from '../content/site'
import { PageHero, CtaBand, usePageMeta, Arrow } from '../components/Blocks'
import Footer from '../components/Footer'

const WHY = [
  { h: 'Real range', p: 'Design one week, a market-entry model the next, a product launch the week after. Work across five disciplines and an investment portfolio instead of one narrow lane.' },
  { h: 'Real ownership', p: 'Small teams, senior clients, your name on the work. You will not spend a year formatting someone else\u2019s slides.' },
  { h: 'Four cities, no commute policy', p: 'Ahmedabad, Oslo, London and Amsterdam, and remote in between. We hire for the work, not the postcode.' },
  { h: 'Both sides of the table', p: 'You will advise companies and help run the ones we own. Very few places let you learn the difference.' },
]
const HIRE = [
  { h: 'Write to us', p: 'Your work, not just your CV. A portfolio, a repo, a campaign, a model. Tell us what you would love to own.' },
  { h: 'A real conversation', p: 'Forty-five minutes with the person you would work with. No riddles, no whiteboard theatre.' },
  { h: 'A piece of real work', p: 'A short, paid exercise drawn from something we are actually doing. You keep the work either way.' },
  { h: 'A decision, fast', p: 'You hear back within a week of the last step. Yes, no, or exactly what would change our mind.' },
]

export default function Careers() {
  usePageMeta('Careers', 'Join Redbarn Ventures. Design, technology, marketing, business and finance roles across Ahmedabad, Oslo, London and Amsterdam, with real ownership and range.', '/careers')
  return (
    <div className="pg">
      <PageHero label="/ Careers" title={<>Build the companies<br /><em>worth believing in.</em></>}>
        <p>We are a small team that advises, owns and backs companies across Europe and India. That means unusual range, real responsibility early, and work you would be glad to put your name on. We are always looking for sharp, curious people who care about the craft.</p>
      </PageHero>

      <section className="sec">
        <span className="lab">/ Why Redbarn</span>
        <h2>The honest pitch.</h2>
        <div className="g4" style={{ marginTop: 40 }}>
          {WHY.map((w, i) => <div className="step" key={w.h}><span className="n">{String(i + 1).padStart(2, '0')}</span><h4>{w.h}</h4><p>{w.p}</p></div>)}
        </div>
      </section>

      <section className="sec" id="roles">
        <div className="sec-head">
          <div><span className="lab">/ Open roles</span><h2>Where we are hiring now.</h2></div>
          <p className="lead" style={{ maxWidth: '38ch' }}>Locations are a starting point, not a rule. If the role fits and the city does not, write anyway.</p>
        </div>
        <div className="roles">
          {ROLES.map((r) => (
            <a className="role" key={r.title} href={mailto(`Application: ${r.title}`)}>
              <div><h3>{r.title}</h3><p>{r.desc}</p></div>
              <div className="meta"><span>{r.team}</span><span>{r.location}</span></div>
              <span className="go">Apply<Arrow /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ How we work</span><h2>What we hold ourselves to.</h2></div>
          <div className="vals">{VALUES.map((v) => <div key={v.name}><h4>{v.name}</h4><p>{v.desc}</p></div>)}</div>
        </div>
      </section>

      <section className="sec">
        <span className="lab">/ How we hire</span>
        <h2>Four steps, no theatre.</h2>
        <div className="g4" style={{ marginTop: 40 }}>
          {HIRE.map((h, i) => <div className="step" key={h.h}><span className="n">{String(i + 1).padStart(2, '0')}</span><h4>{h.h}</h4><p>{h.p}</p></div>)}
        </div>
        <p className="lead" style={{ marginTop: 34 }}>Based in {CITIES.map((c) => c.name).join(', ')} or fully remote. We work across time zones on purpose.</p>
      </section>

      <CtaBand title="Don't see your role?" text="The best people we have hired wrote to us before a role existed. Send your work and tell us what you would build here." cta="Write to us" to="/contact" />
      <Footer />
    </div>
  )
}
