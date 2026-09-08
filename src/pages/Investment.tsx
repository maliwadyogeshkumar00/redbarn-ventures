import { Link } from 'react-router-dom'
import { STAGES, mailto } from '../content/site'
import { PageHero, CtaBand, usePageMeta, Arrow } from '../components/Blocks'
import Footer from '../components/Footer'

const LOOK = [
  { h: 'A problem worth years', p: 'We back companies solving something that stays hard and stays valuable, not something a feature launch elsewhere makes irrelevant.' },
  { h: 'Founders who operate', p: 'People who know their numbers, their customers and their weaknesses. Conviction with candour.' },
  { h: 'A path to durable value', p: 'Margin, retention and a reason to exist in ten years. We are owners, not traders; we underwrite the long game.' },
  { h: 'Somewhere we add more than money', p: 'Design, technology, marketing, business and finance under one roof means our capital arrives with a bench behind it.' },
]
const PROCESS = [
  { h: 'You write', p: 'A short note and a deck to admin@redbarn.ventures. Problem, why now, why you, the ask.' },
  { h: 'We read, properly', p: 'A partner reads every submission. You hear back within two business days: a call, a question, or an honest no.' },
  { h: 'We dig in', p: 'Two to four weeks of real conversation: the market, the numbers, the team, references. Fast where we can be, thorough where it matters.' },
  { h: 'We commit', p: 'Terms in plain language, capital on the timeline we agreed, and the consultancy bench available from day one.' },
]

export default function Investment() {
  usePageMeta('Investment: Pre-seed to Growth', 'Redbarn Ventures invests from first cheque to growth capital: pre-seed and seed, Series A and B, growth and expansion, and long-term strategic positions. How we invest and how to pitch us.', '/investment')
  return (
    <div className="pg">
      <PageHero label="/ Investment" title={<>First cheque<br />to <em>growth.</em></>}>
        <p>We back founders from pre-seed to scale, and we stay. Capital is the start of the relationship, not the end of it: every investment comes with the full Redbarn bench across design, technology, marketing, business and finance.</p>
      </PageHero>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ Thesis</span><h2>Durable value, built to last.</h2></div>
          <div>
            <p className="lead">We are not chasing the next cycle. We invest in companies that will still matter when the cycle has turned: real customers, real margins, and founders with the patience to build something that compounds. We hold for years, we take positions we intend to keep, and we measure ourselves on what the company becomes, not on the next mark-up.</p>
            <p className="lead" style={{ marginTop: 16 }}>That means we are comfortable being early, comfortable being unfashionable, and comfortable saying no to deals that only work if everything goes right.</p>
          </div>
        </div>
      </section>

      <section className="sec">
        <span className="lab">/ What we look for</span>
        <h2>Four things, every time.</h2>
        <div className="g4" style={{ marginTop: 40 }}>
          {LOOK.map((l, i) => <div className="step" key={l.h}><span className="n">{String(i + 1).padStart(2, '0')}</span><h4>{l.h}</h4><p>{l.p}</p></div>)}
        </div>
      </section>

      <section className="sec" id="stages">
        <span className="lab">/ Stages</span>
        <h2>From first cheque to strategic ownership.</h2>
        <div className="stages">
          {STAGES.map((s, i) => (
            <Link to={`/investment/${s.slug}`} className="stage" key={s.slug}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <div><h3>{s.name}</h3><p>{s.desc}</p><span className="tlink" style={{ marginTop: 12, fontSize: 15 }}>Read about this stage<Arrow /></span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <span className="lab">/ How it works</span>
        <h2>Four steps. No black box.</h2>
        <div className="g4" style={{ marginTop: 40 }}>
          {PROCESS.map((p, i) => <div className="step" key={p.h}><span className="n">{String(i + 1).padStart(2, '0')}</span><h4>{p.h}</h4><p>{p.p}</p></div>)}
        </div>
        <a className="tlink" style={{ marginTop: 40 }} href={mailto('Pitch: [company name]')}>Send us your deck<Arrow /></a>
      </section>

      <CtaBand title="Building something?" text="Send the one-line version of the idea and what you need. A partner reads it, and you hear back within two business days." cta="Pitch us" />
      <Footer />
    </div>
  )
}
