import React, { useState, useEffect } from 'react';
import API from '../api'; // Axios instance
import '../styles/menu.css';
import MenuItemCard from '../components/MenuItemCard';
import EditMenuItemModal from '../components/EditMenuItemModal';
import { FaPlus } from 'react-icons/fa';

function Menu() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([{ _id: 'all', name: 'All' }]); // categories from API
  const [selectedCategory, setSelectedCategory] = useState('all'); // use _id for selection
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const categoriesResponse = await API.get('/categories');
        // Prepend "All" category
        setCategories([{ _id: 'all', name: 'All' }, ...categoriesResponse.data]);

        // Fetch menu items
        const menuResponse = await API.get('/menu');
        setMenu(menuResponse.data);
      } catch (err) {
        alert('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAvailabilityChange = (id, newAvailability) => {
    setMenu(prev =>
      prev.map(item =>
        item._id === id ? { ...item, availability: newAvailability } : item
      )
    );
  };

  const handleMenuItemUpdate = (updatedItem) => {
    setMenu(prev =>
      prev.map(item =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  const handleSaveProduct = async (form) => {
    try {
      if (editItem) {
        // Edit existing
        const res = await API.put(`/menu/${editItem._id}`, form);
        handleMenuItemUpdate(res.data);
      } else {
        // Add new
        const res = await API.post('/menu', form);
        setMenu(prev => [...prev, res.data]);
      }
      setModalOpen(false);
      setEditItem(null);
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await API.delete(`/menu/${id}`);
      // Remove deleted item from the menu state
      setMenu(prev => prev.filter(item => item._id !== id));
      setModalOpen(false);
      setEditItem(null);
    } catch (error) {
      alert('Failed to delete the item');
    }
  };
  

  const openAddModal = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  // Filter menu items by selected category _id ('all' means no filtering)
  const filteredMenu = selectedCategory === 'all'
    ? menu
    : menu.filter(item => item.category === selectedCategory);

  return (
    <div className="menu-page">
      <h1 className="menu-heading">Our Menu</h1>

      <div className="category-buttons">
        {categories.map(cat => (
          <button
            key={cat._id}
            className={`category-btn ${selectedCategory === cat._id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat._id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading menu...</p>
      ) : (
        <div className="menu-grid">
          {filteredMenu.map(item => (
            <MenuItemCard
              key={item._id}
              item={item}
              onAvailabilityChange={handleAvailabilityChange}
              onUpdate={handleMenuItemUpdate}
              onEdit={() => {
                setEditItem(item);
                setModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <button className="add-button" onClick={openAddModal}>
        <FaPlus /> Add Item
      </button>

      <EditMenuItemModal
        isOpen={modalOpen}
        item={editItem}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
        mode={editItem ? 'edit' : 'add'}
      />
    </div>
  );
}

export default Menu;
