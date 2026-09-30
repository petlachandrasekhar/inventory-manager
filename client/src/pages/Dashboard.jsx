import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'

import AppNav from '../components/AppNav'
import ItemForm from '../components/ItemForm'
import ItemImageGallery from '../components/ItemImageGallery'
import { useAuth } from '../context/authContext'
import api from '../services/api'

const getApiError = (error) => error.response?.data?.message || 'Something went wrong. Please try again.'

export default function Dashboard() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [stats, setStats] = useState({ totalItems: 0, lowStock: 0, suppliers: 0 })
  const editId = searchParams.get('edit')

  const loadItems = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (category) params.set('category', category)
      const { data } = await api.get(`/items?${params.toString()}`)
      setItems(data.items || [])
      setError('')
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setLoading(false)
    }
  }, [category, search])

  const loadOverview = useCallback(async () => {
    try {
      const [itemsResponse, lowStockResponse, suppliersResponse] = await Promise.all([
        api.get('/items?limit=1'),
        api.get('/items/low-stock'),
        api.get('/suppliers'),
      ])
      setStats({
        totalItems: itemsResponse.data.pagination?.total || 0,
        lowStock: lowStockResponse.data.items?.length || 0,
        suppliers: suppliersResponse.data.suppliers?.length || 0,
      })
      setSuppliers(suppliersResponse.data.suppliers || [])
    } catch {
      toast.error('Summary data is unavailable right now.')
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(loadItems, 150)
    return () => clearTimeout(timer)
  }, [loadItems])

  useEffect(() => {
    const timer = setTimeout(loadOverview, 0)
    return () => clearTimeout(timer)
  }, [loadOverview])

  useEffect(() => {
    const item = items.find((entry) => entry._id === editId)
    if (!item) return undefined
    const timer = setTimeout(() => {
      setEditingItem(item)
      setFormError('')
      setFormOpen(true)
      setSearchParams({}, { replace: true })
    }, 0)
    return () => clearTimeout(timer)
  }, [editId, items, setSearchParams])

  const openCreate = () => { setEditingItem(null); setFormError(''); setFormOpen(true) }
  const openEdit = (item) => { setEditingItem(item); setFormError(''); setFormOpen(true) }

  const saveItem = async (form) => {
    try {
      setSaving(true)
      if (editingItem) await api.put(`/items/${editingItem._id}`, form)
      else await api.post('/items', form)
      setFormOpen(false)
      await loadItems()
      await loadOverview()
      toast.success(editingItem ? 'Item updated.' : 'Item added.')
    } catch (requestError) {
      setFormError(getApiError(requestError))
      toast.error(getApiError(requestError))
    } finally {
      setSaving(false)
    }
  }

  const changeStock = async (item, change) => {
    setActionId(item._id)
    try {
      const { data } = await api.patch(`/items/${item._id}/stock`, { change })
      setItems((current) => current.map((entry) => entry._id === item._id ? data.item : entry))
      await loadOverview()
      toast.success(`Stock updated for ${item.name}.`)
    } catch (requestError) { setError(getApiError(requestError)); toast.error(getApiError(requestError)) } finally { setActionId('') }
  }

  const removeItem = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return
    setActionId(item._id)
    try {
      await api.delete(`/items/${item._id}`)
      setItems((current) => current.filter((entry) => entry._id !== item._id))
      await loadOverview()
      toast.success('Item deleted.')
    } catch (requestError) { setError(getApiError(requestError)); toast.error(getApiError(requestError)) } finally { setActionId('') }
  }

  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))]

  return <main className="inventory-page theme-dashboard">
    <AppNav />
    <header className="inventory-header"><div><p className="kicker">Overview</p><h1>Inventory</h1><p className="subtitle">Track stock, spot shortages, and keep work moving.</p></div><span className="header-user">{user.name}</span></header>
    <section className="stats-grid"><article><span className="stat-icon blue">▦</span><div><small>Total items</small><strong>{stats.totalItems}</strong></div></article><article><span className="stat-icon coral">!</span><div><small>Low stock</small><strong>{stats.lowStock}</strong></div></article><article><span className="stat-icon mint">♧</span><div><small>Suppliers</small><strong>{stats.suppliers}</strong></div></article></section>
    <section className="inventory-toolbar"><div className="search-control"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by item or SKU" aria-label="Search items" /></div><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map((itemCategory) => <option key={itemCategory} value={itemCategory}>{itemCategory}</option>)}</select><button className="primary-button" onClick={openCreate}>＋ Add item</button></section>
    {error && <p className="page-error" role="alert">{error}</p>}
    <section className="inventory-card"><div className="table-heading"><div><h2>All items</h2><p>{loading ? 'Loading inventory...' : `${items.length} item${items.length === 1 ? '' : 's'} shown`}</p></div></div>{loading ? <div className="empty-state">Loading inventory...</div> : items.length === 0 ? <div className="empty-state">No items match your filters.</div> : <div className="table-wrap"><table><thead><tr><th>Item</th><th>SKU</th><th>Category</th><th>Quantity</th><th>Price</th><th>Supplier</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map((item) => { const lowStock = item.quantity <= item.lowStockThreshold; const busy = actionId === item._id; return <tr key={item._id}><td><div className="item-name-cell"><button type="button" className="item-image-button" onClick={() => setSelectedItem(item)} aria-label={`View details for ${item.name}`}><img className="item-thumb" src={item.image || 'https://via.placeholder.com/80x80?text=Item'} alt={item.name} onError={(event) => { event.currentTarget.src = 'https://via.placeholder.com/80x80?text=Item' }} /></button><div><strong>{item.name}</strong><small>{item.unit}</small></div></div></td><td>{item.sku}</td><td>{item.category}</td><td><div className="quantity-control"><button onClick={() => changeStock(item, -1)} disabled={busy || item.quantity <= 0} aria-label={`Decrease ${item.name}`}>−</button><button type="button" className="stock-detail-button" onClick={() => setSelectedItem(item)} aria-label={`View ${item.name} details, ${item.quantity} ${item.unit} in stock`}>{item.quantity}</button><button onClick={() => changeStock(item, 1)} disabled={busy} aria-label={`Increase ${item.name}`}>＋</button></div></td><td>${Number(item.price).toFixed(2)}</td><td>{item.supplier?.name || '—'}</td><td><span className={`stock-badge ${lowStock ? 'low' : 'healthy'}`}>{lowStock ? 'Low stock' : 'In stock'}</span></td><td><div className="row-actions"><button className="text-button" onClick={() => openEdit(item)} disabled={busy}>Edit</button><button className="danger-button" onClick={() => removeItem(item)} disabled={busy}>Delete</button></div></td></tr> })}</tbody></table></div>}</section>
    {selectedItem && <div className="modal-backdrop" onClick={() => setSelectedItem(null)}><div className="modal item-detail-modal" onClick={(event) => event.stopPropagation()}><div className="modal-heading"><h2>{selectedItem.name}</h2><button type="button" className="close-button" onClick={() => setSelectedItem(null)} aria-label="Close item details">×</button></div><div className="item-detail-layout"><ItemImageGallery key={selectedItem._id} item={selectedItem} /><div className="item-detail-info"><p className="kicker">Product detail</p><h3>{selectedItem.name}</h3><p>{selectedItem.category}</p><div className="item-detail-stats"><span><strong>SKU</strong><small>{selectedItem.sku}</small></span><span><strong>Qty</strong><small>{selectedItem.quantity} {selectedItem.unit}</small></span><span><strong>Price</strong><small>${Number(selectedItem.price).toFixed(2)}</small></span><span><strong>Supplier</strong><small>{selectedItem.supplier?.name || '—'}</small></span></div><button type="button" className="primary-button" onClick={() => { setSelectedItem(null); openEdit(selectedItem) }}>Edit item</button></div></div></div></div>}
    {formOpen && <ItemForm key={editingItem?._id || 'new'} item={editingItem} suppliers={suppliers} saving={saving} error={formError} onSubmit={saveItem} onClose={() => setFormOpen(false)} />}
  </main>
}
