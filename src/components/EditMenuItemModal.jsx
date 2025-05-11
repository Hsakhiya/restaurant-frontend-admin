import React, { useState, useEffect } from 'react';
import './EditMenuItemModal.css';

function EditMenuItemModal({ isOpen, item, onClose, onSave, mode }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    jainAvailable: false,
    image: '',
    availability: true // Add availability field to form
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && item) {
        setForm({
          name: item.name || '',
          description: item.description || '',
          price: item.price || '',
          category: item.category || '',
          jainAvailable: item.jainAvailable || false,
          image: item.image || '',
          availability: item.availability || true // Make sure availability is set
        });
      } else {
        setForm({
          name: '',
          description: '',
          price: '',
          category: '',
          jainAvailable: false,
          image: '',
          availability: true // Default availability for a new item
        });
      }
    }
  }, [isOpen, item, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form); // Make sure the form data includes availability
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{mode === 'edit' ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
          <label>
            <input
              type="checkbox"
              name="jainAvailable"
              checked={form.jainAvailable}
              onChange={handleChange}
            />
            Jain Option Available
          </label>
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
          />
          <label>
            <input
              type="checkbox"
              name="availability"
              checked={form.availability}
              onChange={handleChange}
            />
            Available
          </label>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit">
              {mode === 'edit' ? 'Save Changes' : 'Add Item'}
            </button>
            <button type="button" onClick={onClose} style={{ background: '#666' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMenuItemModal;
