import { Link, useParams, Navigate } from 'react-router-dom'
import { ARTICLES, findArticle, fmtDate } from '../content/insights'
import { PageHero, CtaBand, usePageMeta, Arrow } from '../components/Blocks'
import Footer from '../components/Footer'

export function InsightsIndex() {
  usePageMeta('Insights', 'Practical writing from Redbarn Ventures on pitching investors, Six Sigma for growing companies, brand identity, founder accounting, marketing in the age of AI search and choosing a software partner.', '/insights')
  const [lead, ...rest] = ARTICLES
  return (
    <div className="pg">
      <PageHero label="/ Insights" title={<>Notes from<br />the <em>barn.</em></>}>
        <p>Practical writing on building, running and backing companies. No trend pieces, no listicles. The things we find ourselves explaining to founders and clients most often, written down once.</p>
      </PageHero>

      <section className="sec">
        <Link to={`/insights/${lead.slug}`} className="art lead-art">
          <div className="am"><span>{lead.category}</span><span>{fmtDate(lead.date)}</span><span>{lead.read}</span></div>
          <h2>{lead.title}</h2>
          <p>{lead.excerpt}</p>
          <span className="go">Read<Arrow /></span>
        </Link>
        <div className="arts">
          {rest.map((a) => (
            <Link to={`/insights/${a.slug}`} className="art" key={a.slug}>
              <div className="am"><span>{a.category}</span><span>{a.read}</span></div>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
              <span className="go">Read<Arrow /></span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand title="Have a question we haven't written up?" text="Ask it. If it is useful to one founder it is usually useful to ten, and the answer might become the next piece here." cta="Ask us" />
      <Footer />
    </div>
  )
}

export function ArticlePage() {
  const { slug = '' } = useParams()
  const a = findArticle(slug)
  usePageMeta(a ? a.title : 'Insights', a ? a.excerpt : '', `/insights/${slug}`)
  if (!a) return <Navigate to="/insights" replace />
  const others = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3)
  return (
    <div className="pg">
      <section className="phero">
        <span className="lab"><Link to="/insights" className="crumb">Insights</Link> / {a.category}</span>
        <h1 className="art-title">{a.title}</h1>
        <div className="am"><span>{fmtDate(a.date)}</span><span>{a.read} read</span><span>Redbarn Ventures</span></div>
      </section>
      <article className="article">
        {a.body.map((b, i) => b.h ? <h2 key={i}>{b.h}</h2> : b.ul ? <ul key={i}>{b.ul.map((li) => <li key={li}>{li}</li>)}</ul> : <p key={i}>{b.p}</p>)}
      </article>
      <section className="sec">
        <span className="lab">/ Keep reading</span>
        <div className="arts" style={{ marginTop: 24 }}>
          {others.map((o) => (
            <Link to={`/insights/${o.slug}`} className="art" key={o.slug}>
              <div className="am"><span>{o.category}</span><span>{o.read}</span></div>
              <h3>{o.title}</h3>
              <span className="go">Read<Arrow /></span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
      <Footer />
    </div>
  )
}
