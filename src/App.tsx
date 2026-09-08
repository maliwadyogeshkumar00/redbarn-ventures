import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Consultancy from './pages/Consultancy'
import Investment from './pages/Investment'
import Industry from './pages/Industry'
import About from './pages/About'
import Careers from './pages/Careers'
import { InsightsIndex, ArticlePage } from './pages/Insights'
import { Privacy, Terms, Cookies } from './pages/Legal'
import NotFound from './pages/NotFound'
import DomainPage from './pages/DomainPage'
import StagePage from './pages/StagePage'
import IndustryPage from './pages/IndustryPage'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const go = () => { const el = document.getElementById(id); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 110; window.scrollTo({ top: y, behavior: 'smooth' }); return true } return false }
      if (!go()) { let n = 0; const t = setInterval(() => { if (go() || ++n > 20) clearInterval(t) }, 50) }
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consultancy" element={<Consultancy />} />
        <Route path="/consultancy/:slug" element={<DomainPage />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/investment/:slug" element={<StagePage />} />
        <Route path="/industry" element={<Industry />} />
        <Route path="/industry/:slug" element={<IndustryPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/insights" element={<InsightsIndex />} />
        <Route path="/insights/:slug" element={<ArticlePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
