import { Link } from 'react-router-dom'
import { PageHero, usePageMeta, Arrow } from '../components/Blocks'
import Footer from '../components/Footer'

export default function NotFound() {
  usePageMeta('Page not found', 'That page does not exist on redbarn.ventures.', '/404')
  return (
    <div className="pg">
      <PageHero label="/ 404" title={<>Wrong <em>door.</em></>}>
        <p>That page does not exist, or it moved. The barn is still open though.</p>
        <div className="chips" style={{ marginTop: 28 }}>
          <Link to="/" className="chip">Home</Link><Link to="/consultancy" className="chip">Consultancy</Link><Link to="/investment" className="chip">Investment</Link><Link to="/contact" className="chip">Contact</Link>
        </div>
        <Link to="/contact" className="tlink" style={{ marginTop: 34 }}>Talk to a person<Arrow /></Link>
      </PageHero>
      <Footer />
    </div>
  )
}
