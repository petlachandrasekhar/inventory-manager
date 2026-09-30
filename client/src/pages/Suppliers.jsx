import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import AppNav from '../components/AppNav'
import SupplierForm from '../components/SupplierForm'
import { useAuth } from '../context/authContext'
import api from '../services/api'

const getApiError = (error) => error.response?.data?.message || 'Something went wrong. Please try again.'

export default function Suppliers() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [suppliers, setSuppliers] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/suppliers')
      setSuppliers(data.suppliers || [])
      setError('')
    } catch (requestError) {
      setError(getApiError(requestError))
      toast.error(getApiError(requestError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadSuppliers, 0)
    return () => clearTimeout(timer)
  }, [])

  const viewSupplier = async (supplier) => {
    try {
      setDetailLoading(true)
      const { data } = await api.get(`/suppliers/${supplier._id}`)
      setSelected(data)
    } catch (requestError) {
      setError(getApiError(requestError))
      toast.error(getApiError(requestError))
    } finally {
      setDetailLoading(false)
    }
  }

  const saveSupplier = async (form) => {
    try {
      setSaving(true)
      if (editing) await api.put(`/suppliers/${editing._id}`, form)
      else await api.post('/suppliers', form)
      setFormOpen(false)
      setEditing(null)
      await loadSuppliers()
      toast.success(editing ? 'Supplier updated.' : 'Supplier added.')
    } catch (requestError) {
      setFormError(getApiError(requestError))
      toast.error(getApiError(requestError))
    } finally {
      setSaving(false)
    }
  }

  const removeSupplier = async (supplier) => {
    if (!window.confirm(`Delete ${supplier.name}?`)) return
    try {
      await api.delete(`/suppliers/${supplier._id}`)
      setSuppliers((current) => current.filter((entry) => entry._id !== supplier._id))
      if (selected?.supplier?._id === supplier._id) setSelected(null)
      toast.success('Supplier deleted.')
    } catch (requestError) {
      setError(getApiError(requestError))
      toast.error(getApiError(requestError))
    }
  }

  const openCreate = () => {
    setEditing(null)
    setFormError('')
    setFormOpen(true)
  }

  const openEdit = (supplier) => {
    setEditing(supplier)
    setFormError('')
    setFormOpen(true)
  }

  const activeSuppliers = suppliers.filter((supplier) => supplier.itemsSupplied?.length > 0).length
  const suppliedProducts = suppliers.reduce((total, supplier) => total + (supplier.itemsSupplied?.length || 0), 0)
  const filteredSuppliers = useMemo(() => suppliers.filter((supplier) => {
    const searchValue = search.trim().toLowerCase()
    const matchesSearch = !searchValue || [supplier.name, supplier.contactPerson, supplier.email, supplier.phone]
      .some((value) => value?.toLowerCase().includes(searchValue))
    const isActive = supplier.itemsSupplied?.length > 0
    return matchesSearch && (statusFilter === 'all' || (statusFilter === 'active' ? isActive : !isActive))
  }), [search, statusFilter, suppliers])

  return (
    <main className="inventory-page suppliers-page theme-suppliers">
      <AppNav />
      <header className="section-page-header">
        <div>
          <p className="kicker">Partners</p>
          <h1>Suppliers</h1>
          <p className="subtitle">Manage your supply network</p>
        </div>
        <button className="primary-button" onClick={openCreate}>+ Add Supplier</button>
      </header>

      {error && <p className="page-error" role="alert">{error}</p>}

      <section className="stats-grid supplier-stats">
        <article><span className="stat-icon blue">N</span><div><small>Total Suppliers</small><strong>{suppliers.length}</strong></div></article>
        <article><span className="stat-icon mint">A</span><div><small>Active Suppliers</small><strong>{activeSuppliers}</strong></div></article>
        <article><span className="stat-icon coral">P</span><div><small>Products Supplied</small><strong>{suppliedProducts}</strong></div></article>
      </section>

      <section className="inventory-card supplier-list-card">
        <div className="table-heading"><div><h2>All Suppliers</h2><p>{loading ? 'Loading suppliers...' : `${filteredSuppliers.length} of ${suppliers.length} suppliers`}</p></div></div>
        <div className="inventory-toolbar supplier-toolbar">
          <div className="search-control"><span aria-hidden="true">&#128269;</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search suppliers" aria-label="Search suppliers" /></div>
          <select className={`supplier-status-filter ${statusFilter}`} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter suppliers by status">
            <option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
        </div>
        {loading ? <div className="empty-state">Loading suppliers...</div> : filteredSuppliers.length === 0 ? <div className="empty-state">No suppliers match your filters.</div> : (
          <div className="table-wrap"><table className="supplier-table"><thead><tr><th>Supplier</th><th>Contact</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            {filteredSuppliers.map((supplier) => {
              const isActive = supplier.itemsSupplied?.length > 0
              return <tr key={supplier._id}><td><strong>{supplier.name}</strong><small>{supplier.email}</small></td><td>{supplier.contactPerson}</td><td>{supplier.phone}</td><td><span className={`status-badge ${isActive ? 'active' : 'inactive'}`}><i />{isActive ? 'Active' : 'Inactive'}</span></td><td><div className="row-actions"><button className="text-button" onClick={() => viewSupplier(supplier)}>View</button><button className="text-button" onClick={() => openEdit(supplier)}>Edit</button>{isAdmin && <button className="danger-button" onClick={() => removeSupplier(supplier)}>Delete</button>}</div></td></tr>
            })}
          </tbody></table></div>
        )}
      </section>

      {selected && <section className="linked-items"><div className="table-heading"><div><h2>{selected.supplier.name}</h2><p>{detailLoading ? 'Loading linked items...' : `${selected.items.length} linked item${selected.items.length === 1 ? '' : 's'}`}</p></div><button className="close-button" onClick={() => setSelected(null)} aria-label="Close supplier details">x</button></div>{detailLoading ? <div className="empty-state">Loading linked items...</div> : selected.items.length === 0 ? <div className="empty-state">No inventory items are linked to this supplier.</div> : <div className="linked-item-list">{selected.items.map((item) => <div key={item._id}><span><strong>{item.name}</strong><small>{item.sku} - {item.category}</small></span><span className={item.quantity <= item.lowStockThreshold ? 'alert-number' : ''}>{item.quantity} {item.unit}</span></div>)}</div>}</section>}
      {formOpen && <SupplierForm key={editing?._id || 'new'} supplier={editing} saving={saving} error={formError} onSubmit={saveSupplier} onClose={() => setFormOpen(false)} />}
    </main>
  )
}