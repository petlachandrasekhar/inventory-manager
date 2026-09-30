import { useState } from 'react'

const emptyForm = { name: '', contactPerson: '', phone: '', email: '', address: '' }

export default function SupplierForm({ supplier, saving, error, onSubmit, onClose }) {
  const [form, setForm] = useState(() => supplier ? {
    name: supplier.name || '', contactPerson: supplier.contactPerson || '', phone: supplier.phone || '', email: supplier.email || '', address: supplier.address || '',
  } : emptyForm)
  const [validationError, setValidationError] = useState('')

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (Object.values(form).some((value) => !value.trim())) {
      setValidationError('All supplier fields are required.')
      return
    }
    setValidationError('')
    onSubmit(form)
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="supplier-form-title"><div className="modal-heading"><div><p className="kicker">Partners</p><h2 id="supplier-form-title">{supplier ? 'Edit supplier' : 'Add supplier'}</h2></div><button className="close-button" onClick={onClose} aria-label="Close form">×</button></div><form onSubmit={handleSubmit} noValidate><div className="form-grid"><label>Supplier name<input name="name" value={form.name} onChange={updateField} required /></label><label>Contact person<input name="contactPerson" value={form.contactPerson} onChange={updateField} required /></label><label>Phone<input name="phone" value={form.phone} onChange={updateField} required /></label><label>Email<input type="email" name="email" value={form.email} onChange={updateField} required /></label><label className="full-field">Address<input name="address" value={form.address} onChange={updateField} required /></label></div>{(validationError || error) && <p className="form-error" role="alert">{validationError || error}</p>}<div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="auth-button" disabled={saving}>{saving ? 'Saving...' : supplier ? 'Save changes' : 'Add supplier'}</button></div></form></section></div>
}