import { Link, useParams, Navigate } from 'react-router-dom'
import { STAGES, mailto, domainPath } from '../content/site'
import { findArticle } from '../content/insights'
import { PageHero, CtaBand, usePageMeta, Arrow } from '../components/Blocks'
import Footer from '../components/Footer'

export default function StagePage() {
  const { slug = '' } = useParams()
  const s = STAGES.find((x) => x.slug === slug)
  usePageMeta(s ? `${s.name} investment` : 'Investment', s ? `${s.desc} How Redbarn Ventures invests at ${s.name.toLowerCase()}: what we look for and what we bring.` : '', `/investment/${slug}`)
  if (!s) return <Navigate to="/investment" replace />
  const idx = STAGES.findIndex((x) => x.slug === slug)
  const next = STAGES[(idx + 1) % STAGES.length]
  const art = findArticle('pre-seed-pitch-investors-actually-read')

  return (
    <div className="pg">
      <PageHero label={`/ Investment · Stage ${String(idx + 1).padStart(2, '0')}`} title={<>{s.name.split(' & ')[0]}<br /><em>{s.name.includes(' & ') ? `& ${s.name.split(' & ')[1]}.` : ''}</em></>}>
        <p>{s.desc}</p>
        <div className="chips"><a className="chip" href={mailto(`Pitch (${s.name}): [company name]`)}>Pitch us at this stage</a><Link className="chip" to="/investment">All stages</Link></div>
      </PageHero>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ What this stage means</span><h2>Where you are.</h2></div>
          <div>{s.long.map((p) => <p className="lead" key={p} style={{ marginBottom: 16 }}>{p}</p>)}</div>
        </div>
      </section>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ What we look for</span><h2>Four things, every time.</h2></div>
          <ul className="fw">{s.look.map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
      </section>

      <section className="sec">
        <span className="lab">/ What we bring</span>
        <h2>Capital, with the bench behind it.</h2>
        <div className="g4" style={{ marginTop: 40 }}>
          {s.bring.map((b, i) => <div className="step" key={b.h}><span className="n">{String(i + 1).padStart(2, '0')}</span><h4>{b.h}</h4><p>{b.p}</p>{['Design', 'Technology', 'Marketing', 'Business', 'Finance'].includes(b.h) && <Link to={domainPath(b.h)} className="tlink" style={{ marginTop: 12, fontSize: 14 }}>{b.h} consultancy<Arrow /></Link>}</div>)}
        </div>
      </section>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ How to pitch</span><h2>Keep it short. Make it real.</h2></div>
          <div>
            <p className="lead">A short note and a deck to admin@redbarn.ventures with the stage in the subject line. Problem, why now, why you, traction, the ask. A partner reads every submission and you hear back within two business days.</p>
            {art && <Link to={`/insights/${art.slug}`} className="tlink" style={{ marginTop: 22 }}>{art.title}<Arrow /></Link>}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><div><span className="lab">/ Next stage</span><h2>{next.name}.</h2></div><Link to={`/investment/${next.slug}`} className="tlink">Read about this stage<Arrow /></Link></div>
      </section>

      <CtaBand title="Building something?" text={`If you are at ${s.name.toLowerCase()}, send us the one-line version and what you need.`} cta="Pitch us" />
      <Footer />
    </div>
  )
}
