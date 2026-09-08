import { Link, useParams, Navigate } from 'react-router-dom'
import { INDUSTRIES, DOMAINS, mailto } from '../content/site'
import { PageHero, CtaBand, usePageMeta, Arrow } from '../components/Blocks'
import Footer from '../components/Footer'

export default function IndustryPage() {
  const { slug = '' } = useParams()
  const ind = INDUSTRIES.find((x) => x.slug === slug)
  usePageMeta(ind ? `${ind.name}: consultancy & investment` : 'Industry', ind ? `${ind.desc} How Redbarn Ventures works with ${ind.name.toLowerCase()} companies.` : '', `/industry/${slug}`)
  if (!ind) return <Navigate to="/industry" replace />
  const idx = INDUSTRIES.findIndex((x) => x.slug === slug)
  const next = INDUSTRIES[(idx + 1) % INDUSTRIES.length]

  return (
    <div className="pg">
      <PageHero label={`/ Industry · ${String(idx + 1).padStart(2, '0')}`} title={<>{ind.name.split(' & ')[0]}{ind.name.includes(' & ') ? <><br /><em>& {ind.name.split(' & ')[1]}.</em></> : <><br /><em>.</em></>}</>}>
        <p>{ind.desc}</p>
        <div className="chips"><a className="chip" href={mailto(`${ind.name} enquiry`)}>Talk to us about {ind.name.toLowerCase()}</a><Link className="chip" to="/industry">All industries</Link></div>
      </PageHero>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ The landscape</span><h2>What we see.</h2></div>
          <p className="lead">{ind.long}</p>
        </div>
      </section>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ The challenges</span><h2>Where value is lost.</h2></div>
          <ul className="fw">{ind.challenges.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      </section>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ How we help</span><h2>Solved whole.</h2><p className="lead" style={{ marginTop: 16 }}>{ind.help}</p></div>
          <div className="g3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {ind.services.map((sname) => {
              const d = DOMAINS.find((x) => x.name === sname)
              return d
                ? <Link to={`/consultancy/${d.slug}`} className="tile" key={sname}><span className="n">Consultancy</span><h3>{d.name}</h3><p>{d.tagline}</p></Link>
                : <Link to="/investment" className="tile" key={sname}><span className="n">Capital</span><h3>Investment</h3><p>First cheque to growth, with the bench behind it.</p></Link>
            })}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><div><span className="lab">/ Next industry</span><h2>{next.name}.</h2></div><Link to={`/industry/${next.slug}`} className="tlink">Read about this industry<Arrow /></Link></div>
      </section>

      <CtaBand title={`Working in ${ind.name.toLowerCase()}?`} text="Tell us what is not working. We will say plainly whether we can help and which team should be in the room." />
      <Footer />
    </div>
  )
}
