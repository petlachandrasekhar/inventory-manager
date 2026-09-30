import { Link } from 'react-router-dom'
import LiveStatus from '../components/LiveStatus'

const inventoryRows = [
  { name: 'Wireless Headphones', sku: 'WH-204', stock: '842', state: 'Healthy', tone: 'good' },
  { name: 'Canvas Backpack', sku: 'CB-118', stock: '128', state: 'Watch', tone: 'watch' },
  { name: 'Travel Bottle', sku: 'TB-056', stock: '64', state: 'Restock', tone: 'alert' },
]

export default function Home() {
  return (
    <main className="home-page theme-home">
      <div className="home-orbit home-orbit-one" />
      <div className="home-orbit home-orbit-two" />
      <header className="home-nav">
        <Link className="home-brand" to="/"><span className="nav-mark">C</span><span>Chandu <strong>Inventory360</strong><small>SMART STOCK CONTROL</small></span></Link>
        <nav><LiveStatus /><Link className="home-sign-in" to="/login">Sign in <span>↗</span></Link></nav>
      </header>
      <section className="home-hero" id="platform">
        <div className="hero-copy">
          <p className="home-kicker"><span className="kicker-dot" /> The calm side of operations</p>
          <h1>See what matters.<br /><em>Move with clarity.</em></h1>
          <p className="hero-description">Chandu Inventory360 turns inventory data into a clear next move, so your team can keep products flowing and customers delighted.</p>
          <div className="hero-actions"><Link className="gold-button" to="/register">Start managing <span>↗</span></Link></div>
          <div className="mini-metrics"><div><strong>12K+</strong><span>Tracked items</span></div><div><strong>96%</strong><span>Restock accuracy</span></div><div><strong>24/7</strong><span>Stock visibility</span></div></div>
        </div>
        <div className="home-visual" aria-label="Inventory dashboard preview">
          <div className="visual-glow" />
          <div className="visual-panel">
            <div className="visual-header"><div><small>Good morning, Admin</small><strong>Operations overview</strong></div></div>
            <div className="visual-summary"><div><span>Inventory value</span><strong>$248,620 <b>+12.4%</b></strong></div><div className="sparkline"><i /><i /><i /><i /><i /><i /><i /></div></div>
            <div className="visual-grid"><div className="metric-box"><span>Units on hand</span><strong>8,742</strong><small>Across 4 locations</small></div><div className="metric-box warm"><span>Needs attention</span><strong>24</strong><small>6 critical alerts</small></div></div>
            <div className="visual-list"><div className="list-heading"><span>Stock pulse</span><span>Today</span></div>{inventoryRows.map((row) => <div className="visual-row" key={row.sku}><span><strong>{row.name}</strong><small>{row.sku}</small></span><b>{row.stock}</b><em className={row.tone}>{row.state}</em></div>)}</div>

            <div className="featured-product-card">
              <img
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"
                alt="Wireless Headphones"
              />
              <div className="featured-product-info">
                <span className="featured-label">Featured unit</span>
                <h3>Wireless Headphones</h3>
                <p>SKU WH-204 • 842 units in stock</p>
                <div className="featured-meta">
                  <span>Noise cancelling</span>
                  <span>32h battery</span>
                  <span>Fast shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
