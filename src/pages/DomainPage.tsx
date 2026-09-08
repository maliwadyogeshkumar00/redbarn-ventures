import { Link, useParams, Navigate } from 'react-router-dom'
import { DOMAINS, INDUSTRIES, mailto } from '../content/site'
import { findArticle } from '../content/insights'
import { PageHero, CtaBand, usePageMeta, Arrow } from '../components/Blocks'
import Footer from '../components/Footer'

export default function DomainPage() {
  const { slug = '' } = useParams()
  const d = DOMAINS.find((x) => x.slug === slug)
  usePageMeta(d ? `${d.name} Consultancy` : 'Consultancy', d ? `${d.intro} Redbarn Ventures ${d.name.toLowerCase()} consultancy: ${d.services.map((s) => s.name.toLowerCase()).join(', ')}.` : '', `/consultancy/${slug}`)
  if (!d) return <Navigate to="/consultancy" replace />
  const idx = DOMAINS.findIndex((x) => x.slug === slug)
  const next = DOMAINS[(idx + 1) % DOMAINS.length]
  const inds = INDUSTRIES.filter((i) => i.services.includes(d.name)).slice(0, 4)
  const art = findArticle(d.article)

  return (
    <div className="pg">
      <PageHero label={`/ Consultancy · ${String(idx + 1).padStart(2, '0')}`} title={<>{d.name}<br /><em>consultancy.</em></>}>
        <p>{d.tagline} {d.intro}</p>
        <div className="chips"><a className="chip" href={mailto(`${d.name} enquiry`)}>Enquire about {d.name.toLowerCase()}</a><Link className="chip" to="/consultancy">All disciplines</Link></div>
      </PageHero>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ Why it matters</span><h2>{d.tagline}</h2></div>
          <div>{d.long.map((p) => <p className="lead" key={p} style={{ marginBottom: 16 }}>{p}</p>)}</div>
        </div>
      </section>

      <section className="sec">
        <span className="lab">/ What we do</span>
        <h2>Six things, done properly.</h2>
        <div className="svcs">
          {d.services.map((s, i) => <div className="svcc" key={s.name}><span className="n">{String(i + 1).padStart(2, '0')}</span><h3>{s.name}</h3><p>{s.desc}</p></div>)}
        </div>
      </section>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ Who it is for</span><h2>You will recognise yourself.</h2></div>
          <ul className="fw">{d.forWho.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      </section>

      <section className="sec">
        <span className="lab">/ How we work</span>
        <h2>Four steps, every time.</h2>
        <div className="g4" style={{ marginTop: 40 }}>
          {d.process.map((s, i) => <div className="step" key={s.h}><span className="n">{String(i + 1).padStart(2, '0')}</span><h4>{s.h}</h4><p>{s.p}</p></div>)}
        </div>
        <p className="lead" style={{ marginTop: 34 }}><b style={{ color: 'var(--rb-paper)' }}>How we engage.</b> {d.engage}</p>
      </section>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ Where we apply it</span><h2>Industries.</h2><p className="lead" style={{ marginTop: 16 }}>{d.name} work we do most often, by sector.</p></div>
          <div className="g3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {inds.map((i) => <Link to={`/industry/${i.slug}`} className="tile" key={i.slug}><span className="n">Industry</span><h3>{i.name}</h3><p>{i.desc.split('.')[0]}.</p></Link>)}
          </div>
        </div>
      </section>

      {art && (
        <section className="sec">
          <div className="sec-head"><div><span className="lab">/ From Insights</span><h2>Further reading.</h2></div></div>
          <Link to={`/insights/${art.slug}`} className="art lead-art"><div className="am"><span>{art.category}</span><span>{art.read}</span></div><h2>{art.title}</h2><p>{art.excerpt}</p><span className="go">Read<Arrow /></span></Link>
        </section>
      )}

      <section className="sec">
        <div className="sec-head"><div><span className="lab">/ Next</span><h2>{next.name} consultancy.</h2></div><Link to={`/consultancy/${next.slug}`} className="tlink">{next.tagline}<Arrow /></Link></div>
      </section>

      <CtaBand title={`Talk to us about ${d.name.toLowerCase()}.`} text="Describe what is not working and we will tell you plainly what would fix it, and whether we are the right team." cta="Start a conversation" />
      <Footer />
    </div>
  )
}
