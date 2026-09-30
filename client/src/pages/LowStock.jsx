import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import AppNav from '../components/AppNav'
import ItemImageGallery from '../components/ItemImageGallery'
import { useAuth } from '../context/authContext'
import api from '../services/api'

export default function LowStock() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    api.get('/items/low-stock').then(({ data }) => setItems(data.items || [])).catch((requestError) => { const message = requestError.response?.data?.message || 'Unable to load low-stock items.'; setError(message); toast.error(message) }).finally(() => setLoading(false))
  }, [])

  return <main className="inventory-page theme-inventory"><AppNav /><header className="section-page-header"><div><p className="kicker">Attention needed</p><h1>Low-stock items</h1><p className="subtitle">Items at or below their reorder threshold.</p></div><span className="count-pill">{items.length} alerts</span></header>{error && <p className="page-error" role="alert">{error}</p>}<section className="inventory-card alert-card">{loading ? <div className="empty-state">Checking stock levels...</div> : items.length === 0 ? <div className="empty-state">Great news, {user.name}. No items need restocking.</div> : <div className="table-wrap"><table><thead><tr><th>Item</th><th>SKU</th><th>Quantity</th><th>Threshold</th><th>Supplier</th><th>Status</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item._id}><td><div className="item-name-cell"><button type="button" className="item-image-button" onClick={() => setSelectedItem(item)} aria-label={`View details for ${item.name}`}><img className="item-thumb" src={item.image || 'https://via.placeholder.com/80x80?text=Item'} alt={item.name} onError={(event) => { event.currentTarget.src = 'https://via.placeholder.com/80x80?text=Item' }} /></button><div><strong>{item.name}</strong><small>{item.category}</small></div></div></td><td>{item.sku}</td><td><button type="button" className="stock-detail-button alert-number" onClick={() => setSelectedItem(item)} aria-label={`View ${item.name} details, ${item.quantity} ${item.unit} in stock`}>{item.quantity} {item.unit}</button></td><td>{item.lowStockThreshold}</td><td>{item.supplier?.name || '—'}</td><td><span className="stock-badge low">Low stock</span></td><td><Link className="text-button" to={`/dashboard?edit=${item._id}`}>Edit item</Link></td></tr>)}</tbody></table></div>}</section>{selectedItem && <div className="modal-backdrop" onClick={() => setSelectedItem(null)}><div className="modal item-detail-modal" role="dialog" aria-modal="true" aria-labelledby="low-stock-detail-title" onClick={(event) => event.stopPropagation()}><div className="modal-heading"><h2 id="low-stock-detail-title">{selectedItem.name}</h2><button type="button" className="close-button" onClick={() => setSelectedItem(null)} aria-label="Close item details">×</button></div><div className="item-detail-layout"><ItemImageGallery key={selectedItem._id} item={selectedItem} /><div className="item-detail-info"><p className="kicker">Low-stock item</p><h3>{selectedItem.name}</h3><p>{selectedItem.category}</p><div className="item-detail-stats"><span><strong>SKU</strong><small>{selectedItem.sku}</small></span><span><strong>Quantity</strong><small>{selectedItem.quantity} {selectedItem.unit}</small></span><span><strong>Reorder threshold</strong><small>{selectedItem.lowStockThreshold} {selectedItem.unit}</small></span><span><strong>Supplier</strong><small>{selectedItem.supplier?.name || '—'}</small></span></div><Link className="primary-button" to={`/dashboard?edit=${selectedItem._id}`}>Edit item</Link></div></div></div></div>}</main>
}