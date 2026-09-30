import { useState } from 'react'

const emptyForm = { name: '', sku: '', category: '', image: '', quantity: 0, unit: 'pcs', price: 0, lowStockThreshold: 10, supplier: '' }
const formFromItem = (item) => item ? {
  name: item.name || '', sku: item.sku || '', category: item.category || '', image: item.image || '', quantity: item.quantity ?? 0,
  unit: item.unit || 'pcs', price: item.price ?? 0, lowStockThreshold: item.lowStockThreshold ?? 10,
  supplier: item.supplier?._id || item.supplier || '',
} : emptyForm

export default function ItemForm({ item, suppliers, saving, error, onSubmit, onClose }) {
  const [form, setForm] = useState(() => formFromItem(item))
  const [validationError, setValidationError] = useState('')

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.sku.trim() || !form.category.trim() || !form.unit.trim()) {
      setValidationError('Name, SKU, category, and unit are required.')
      return
    }
    if ([form.quantity, form.price, form.lowStockThreshold].some((value) => Number(value) < 0 || Number.isNaN(Number(value)))) {
      setValidationError('Quantity, price, and threshold must be valid non-negative numbers.')
      return
    }
    setValidationError('')
    onSubmit({ ...form, image: form.image.trim(), quantity: Number(form.quantity), price: Number(form.price), lowStockThreshold: Number(form.lowStockThreshold), supplier: form.supplier || null })
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="item-form-title"><div className="modal-heading"><div><p className="kicker">Inventory</p><h2 id="item-form-title">{item ? 'Edit item' : 'Add item'}</h2></div><button className="close-button" onClick={onClose} aria-label="Close form">×</button></div><form onSubmit={handleSubmit} noValidate><div className="form-grid"><label>Item name<input name="name" value={form.name} onChange={updateField} required /></label><label>SKU<input name="sku" value={form.sku} onChange={updateField} required disabled={Boolean(item)} /></label><label>Category<input name="category" value={form.category} onChange={updateField} required /></label><label>Unit<input name="unit" value={form.unit} onChange={updateField} required /></label><label>Image URL<input name="image" value={form.image} onChange={updateField} placeholder="https://example.com/item.jpg" /></label>{form.image ? <div className="item-form-preview"><img src={form.image} alt="Item preview" onError={(event) => { event.currentTarget.style.display = 'none' }} /></div> : null}<label>Quantity<input type="number" name="quantity" min="0" value={form.quantity} onChange={updateField} required /></label><label>Unit price<input type="number" name="price" min="0" step="0.01" value={form.price} onChange={updateField} required /></label><label>Low-stock threshold<input type="number" name="lowStockThreshold" min="0" value={form.lowStockThreshold} onChange={updateField} required /></label><label>Supplier<select name="supplier" value={form.supplier} onChange={updateField}><option value="">No supplier</option>{suppliers.map((supplier) => <option key={supplier._id} value={supplier._id}>{supplier.name}</option>)}</select></label></div>{(validationError || error) && <p className="form-error" role="alert">{validationError || error}</p>}<div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="auth-button" disabled={saving}>{saving ? 'Saving...' : item ? 'Save changes' : 'Add item'}</button></div></form></section></div>
}