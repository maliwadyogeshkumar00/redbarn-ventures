import { Link } from 'react-router-dom'
import { DOMAINS } from '../content/site'
import { PageHero, CtaBand, usePageMeta, Arrow } from '../components/Blocks'
import Footer from '../components/Footer'

export default function Consultancy() {
  usePageMeta('Consultancy: Design, Technology, Marketing, Business & Finance', 'Redbarn Ventures consultancy: brand and web design, software development, digital marketing, Six Sigma business consulting and accounting, delivered by one team across Ahmedabad, Oslo, London and Amsterdam.', '/consultancy')
  return (
    <div className="pg">
      <PageHero label="/ Consultancy" title={<>Five disciplines.<br /><em>One team.</em></>}>
        <p>Most companies hire a design agency, a dev shop, a marketing firm, a management consultant and an accountant, then spend their time making them talk to each other. We put all five under one roof so the work gets solved whole.</p>
        <div className="chips">{DOMAINS.map((d) => <Link key={d.slug} to={`/consultancy/${d.slug}`} className="chip">{d.name}</Link>)}</div>
      </PageHero>

      {DOMAINS.map((d, i) => (
        <section className="dom" key={d.slug}>
          <div className="g2">
            <div>
              <span className="lab">/ {String(i + 1).padStart(2, '0')} · {d.name}</span>
              <h2>{d.tagline}</h2>
              <p className="lead">{d.intro}</p>
              <p className="engage"><b>How we engage.</b> {d.engage}</p>
              <Link className="tlink" to={`/consultancy/${d.slug}`}>Explore {d.name.toLowerCase()} consultancy<Arrow /></Link>
            </div>
            <div>
              <div className="svc-h">What we do</div>
              <ul className="svc">{d.services.map((s) => <li key={s.name}>{s.name}</li>)}</ul>
            </div>
          </div>
        </section>
      ))}

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ Why one roof</span><h2>The handoffs are where value dies.</h2></div>
          <div>
            <p className="lead">A brand built by one firm, a website built by another and a campaign run by a third rarely add up to one company. Every seam costs money and time. Because our design, technology, marketing, business and finance teams sit together, a rebrand can ship with its website, a new market entry can arrive with its financial model, and a process fix can come with the software to hold it in place.</p>
            <p className="lead" style={{ marginTop: 16 }}>And because we also invest in and own companies, we have lived the other side of every recommendation we make. <Link to="/investment" className="inl">See how we invest</Link>.</p>
          </div>
        </div>
      </section>

      <CtaBand title="Tell us the problem." text="Not sure which discipline you need? That is normal. Describe what is not working and we will tell you plainly what would fix it, and whether we are the right team." />
      <Footer />
    </div>
  )
}
