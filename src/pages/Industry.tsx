import { Link } from 'react-router-dom'
import { INDUSTRIES, DOMAINS } from '../content/site'
import { PageHero, CtaBand, usePageMeta } from '../components/Blocks'
import Footer from '../components/Footer'

const slugOf = (name: string) => DOMAINS.find((d) => d.name === name)?.slug

export default function Industry() {
  usePageMeta('Industries we serve', 'Redbarn Ventures works across technology and SaaS, fintech, healthcare, consumer and retail, energy and climate, media, real estate and industrial manufacturing, with consultancy and investment under one roof.', '/industry')
  return (
    <div className="pg">
      <PageHero label="/ Industry" title={<>Eight industries.<br /><em>One way of working.</em></>}>
        <p>We do not pretend to be specialists in everything. We are specialists in a way of working that travels: understand the problem, fix it whole, and stay long enough to see it hold. These are the industries where that has earned us the right to work.</p>
        <div className="chips">{INDUSTRIES.map((i) => <a key={i.slug} href={`#${i.slug}`} className="chip">{i.name}</a>)}</div>
      </PageHero>

      <section className="sec">
        <div className="inds">
          {INDUSTRIES.map((ind, i) => (
            <div className="ind" id={ind.slug} key={ind.slug}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{ind.name}</h3>
              <p>{ind.desc}</p>
              <div className="tags">{ind.services.map((s) => (
                s === 'Investment' ? <Link key={s} to="/investment" className="tag">{s}</Link> : <Link key={s} to={`/consultancy#${slugOf(s)}`} className="tag">{s}</Link>
              ))}</div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand title="Your industry not listed?" text="Most of our work started with a conversation that did not fit a category. Tell us what you are building and we will tell you honestly whether we can help." />
      <Footer />
    </div>
  )
}
