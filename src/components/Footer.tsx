import { Link } from 'react-router-dom'
import { DOMAINS, EMAIL, CITIES } from '../content/site'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-top">
        <div className="brand"><b>Redbarn</b><p>Consulting, long-term ownership and investing under one roof, so the right idea, the right operators and the right capital finally work together.</p><a className="fmail" href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
        <div className="cols">
          <div className="fcol"><h5>Consultancy</h5>{DOMAINS.map((d) => <Link key={d.slug} to={`/consultancy#${d.slug}`}>{d.name}</Link>)}</div>
          <div className="fcol"><h5>Company</h5><Link to="/investment">Investment</Link><Link to="/industry">Industry</Link><Link to="/about">About</Link><Link to="/careers">Careers</Link><Link to="/insights">Insights</Link><Link to="/contact">Contact</Link></div>
          <div className="fcol"><h5>Legal</h5><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms of use</Link><Link to="/cookies">Cookie policy</Link></div>
        </div>
      </div>
      <div className="footmark">REDBARN</div>
      <div className="foot-bot"><span>&copy; {new Date().getFullYear()} Redbarn Ventures. All rights reserved.</span><span>{CITIES.map((c) => c.name).join(' · ')}</span></div>
    </footer>
  )
}
