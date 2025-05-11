import React, { useState, useEffect } from 'react';
import API from '../api'; // Axios instance
import '../styles/menu.css';
import MenuItemCard from '../components/MenuItemCard';
import EditMenuItemModal from '../components/EditMenuItemModal';
import { FaPlus } from 'react-icons/fa';

function Menu() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await API.get('/menu');
        setMenu(response.data);
        const uniqueCategories = ['All', ...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        alert('Failed to fetch menu');
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
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

  const openAddModal = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const filteredMenu = selectedCategory === 'All'
    ? menu
    : menu.filter(item => item.category === selectedCategory);

  return (
    <div className="menu-page">
      <h1 className="menu-heading">Our Menu</h1>

      <div className="category-buttons">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
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
        mode={editItem ? 'edit' : 'add'}
      />
    </div>
  );
}

export default Menu;
