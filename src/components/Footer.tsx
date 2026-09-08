import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-top">
        <div className="brand"><b>Redbarn</b><p>A founder-first studio and investor. We build and back the companies worth believing in.</p></div>
        <div className="cols">
          <div className="fcol"><h5>Consultancy</h5>{['Design', 'Technology', 'Marketing', 'Business', 'Finance'].map((s) => <a key={s} href="#" onClick={(e) => e.preventDefault()}>{s}</a>)}</div>
          <div className="fcol"><h5>Investment</h5>{['Pre-seed & Seed', 'Growth & Expansion', 'Portfolio'].map((s) => <a key={s} href="#" onClick={(e) => e.preventDefault()}>{s}</a>)}</div>
          <div className="fcol"><h5>Company</h5><a href="#" onClick={(e) => e.preventDefault()}>About</a><a href="#" onClick={(e) => e.preventDefault()}>Careers</a><a href="#" onClick={(e) => e.preventDefault()}>Insights</a><Link to="/contact">Contact</Link></div>
        </div>
      </div>
      <div className="footmark">REDBARN</div>
      <div className="foot-bot"><span>&copy; {new Date().getFullYear()} Redbarn Ventures</span><span>Amsterdam &middot; Ahmedabad &middot; London</span></div>
    </footer>
  )
}
