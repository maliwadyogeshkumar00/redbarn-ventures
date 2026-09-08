import { Link } from 'react-router-dom'
import { VALUES, CITIES } from '../content/site'
import { PageHero, CtaBand, usePageMeta } from '../components/Blocks'
import Footer from '../components/Footer'

const PILLARS = [
  { h: 'Consult', p: 'Design, technology, marketing, business and finance, delivered as one team. We fix problems whole instead of handing them between agencies.', to: '/consultancy', c: 'Consultancy' },
  { h: 'Own', p: 'We hold long-term positions in companies we believe in and run them like owners, because we are. Patience is a strategy, not a slogan.', to: '/investment#strategic', c: 'Long-term ownership' },
  { h: 'Invest', p: 'From first cheque to growth capital. Every investment arrives with the full consultancy bench behind it, from day one.', to: '/investment', c: 'Investment' },
]

export default function About() {
  usePageMeta('About Redbarn Ventures', 'Redbarn Ventures unites consulting, long-term ownership and investing under one roof, working with founders and companies across Ahmedabad, Oslo, London and Amsterdam.', '/about')
  return (
    <div className="pg">
      <PageHero label="/ About" title={<>Consulting, ownership<br />and investing <em>under one roof.</em></>}>
        <p>Redbarn Ventures was built on a simple frustration: the right idea, the right operators and the right capital rarely meet in the same room. Advisers advise and leave. Investors write cheques and wait. Operators are left to make it all work. We decided to be all three.</p>
      </PageHero>

      <section className="sec">
        <span className="lab">/ What we do</span>
        <h2>Three roles. One point of view.</h2>
        <div className="g3" style={{ marginTop: 40 }}>
          {PILLARS.map((p) => (
            <Link to={p.to} className="tile" key={p.h}><span className="n">{p.c}</span><h3>{p.h}</h3><p>{p.p}</p></Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ The idea</span><h2>Durable value, built to last.</h2></div>
          <div>
            <p className="lead">Most of the business world is optimised for the next quarter. We are not. Whether we are advising a company, running one or backing one, the question is the same: will this still be worth something in ten years? That question changes what we recommend, how we build, and which cheques we write.</p>
            <p className="lead" style={{ marginTop: 16 }}>It also means we tell the truth early. A founder who hears an honest no in week one is better off than one who hears a polite yes for six months. Candour is cheaper than regret.</p>
          </div>
        </div>
      </section>

      <section className="sec">
        <span className="lab">/ How we work</span>
        <h2>What we hold ourselves to.</h2>
        <div className="g4" style={{ marginTop: 40 }}>
          {VALUES.map((v, i) => <div className="step" key={v.name}><span className="n">{String(i + 1).padStart(2, '0')}</span><h4>{v.name}</h4><p>{v.desc}</p></div>)}
        </div>
      </section>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ Where we are</span><h2>Four cities. One team.</h2></div>
          <div>
            <div className="cityline">{CITIES.map((c) => <span key={c.name}>{c.name}</span>)}</div>
            <p className="lead" style={{ marginTop: 22 }}>We work with founders and companies across Europe and India, mostly remotely, and we meet in person when it genuinely moves things forward. We do not publish office addresses; we would rather meet where the work is.</p>
          </div>
        </div>
      </section>

      <CtaBand title="Let's talk." text="Whether you want advice, a partner or capital, the conversation starts the same way." />
      <Footer />
    </div>
  )
}
