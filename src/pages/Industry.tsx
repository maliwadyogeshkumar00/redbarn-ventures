import { Link } from 'react-router-dom'
import { INDUSTRIES, domainPath } from '../content/site'
import { Arrow } from '../components/Blocks'
import { PageHero, CtaBand, usePageMeta } from '../components/Blocks'
import Footer from '../components/Footer'


export default function Industry() {
  usePageMeta('Industries we serve', 'Redbarn Ventures works across technology and SaaS, fintech, healthcare, consumer and retail, energy and climate, media, real estate and industrial manufacturing, with consultancy and investment under one roof.', '/industry')
  return (
    <div className="pg">
      <PageHero label="/ Industry" title={<>Eight industries.<br /><em>One way of working.</em></>}>
        <p>We do not pretend to be specialists in everything. We are specialists in a way of working that travels: understand the problem, fix it whole, and stay long enough to see it hold. These are the industries where that has earned us the right to work.</p>
        <div className="chips">{INDUSTRIES.map((i) => <Link key={i.slug} to={`/industry/${i.slug}`} className="chip">{i.name}</Link>)}</div>
      </PageHero>

      <section className="sec">
        <div className="inds">
          {INDUSTRIES.map((ind, i) => (
            <div className="ind" key={ind.slug}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <h3><Link to={`/industry/${ind.slug}`} className="plain">{ind.name}</Link></h3>
              <p>{ind.desc}</p>
              <div className="tags">{ind.services.map((s) => (
                <Link key={s} to={domainPath(s)} className="tag">{s}</Link>
              ))}</div>
              <Link to={`/industry/${ind.slug}`} className="tlink" style={{ marginTop: 18, fontSize: 15 }}>Read more<Arrow /></Link>
            </div>
          ))}
        </div>
      </section>

      <CtaBand title="Your industry not listed?" text="Most of our work started with a conversation that did not fit a category. Tell us what you are building and we will tell you honestly whether we can help." />
      <Footer />
    </div>
  )
}
