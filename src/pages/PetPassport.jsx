import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Modal from '../components/Modal';
import './PetPassport.css';

const PetPassport = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    photo_url: '',
    cuteness_level: 100,
    badges: []
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('pets')
        .insert([{
          name: formData.name,
          breed: formData.breed,
          age: formData.age,
          photo_url: formData.photo_url || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=150&q=80',
          cuteness_level: formData.cuteness_level,
          badges: formData.badges.length > 0 ? formData.badges : ['🐾 New Pet'],
          status: 'Active'
        }])
        .select();

      if (error) throw error;

      // Add new pet to the list
      setPets([...pets, data[0]]);

      // Reset form and close modal
      setFormData({
        name: '',
        breed: '',
        age: '',
        photo_url: '',
        cuteness_level: 100,
        badges: []
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding pet:', error.message);
      alert('Erro ao cadastrar pet: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="page-content flex-center">
        <div className="text-xl">Carregando Passaportes... 🐾</div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <h2 className="text-2xl font-bold">Passaporte Pet 🐾</h2>
          <p className="text-secondary">Identidade Digital & Registros</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Registrar Novo Pet
        </button>
      </header>

      <div className="passport-grid">
        {pets.map((pet) => (
          <div key={pet.id} className="passport-card glass-panel">
            <div className="passport-header">
              <span className={`status-badge ${pet.status === 'Checked In' ? 'active' : ''}`}>
                {pet.status}
              </span>
              <div className="passport-id">ID: #{String(pet.id).padStart(3, '0')}</div>
            </div>

            <div className="pet-photo-container">
              <img src={pet.photo_url || 'https://via.placeholder.com/150'} alt={pet.name} className="pet-photo" />
              <div className="photo-ring"></div>
            </div>

            <div className="pet-info">
              <h3 className="pet-name">{pet.name}</h3>
              <p className="pet-breed">{pet.breed}, {pet.age}</p>
            </div>

            <div className="stats-container">
              <div className="stat-row">
                <span>Nível de Fofura</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pet.cuteness_level}%` }}></div>
                </div>
              </div>
            </div>

            <div className="badges-container">
              {pet.badges && pet.badges.map((badge, index) => (
                <span key={index} className="pet-badge">{badge}</span>
              ))}
            </div>

            <button className="view-profile-btn">Ver Passaporte Completo</button>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Novo Pet">
        <form onSubmit={handleAddPet} className="pet-form">
          <div className="form-group">
            <label>Nome do Pet *</label>
            <input
              type="text"
              placeholder="Luna"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Raça *</label>
            <input
              type="text"
              placeholder="Golden Retriever"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Idade *</label>
            <input
              type="text"
              placeholder="2 anos"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>URL da Foto (opcional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.photo_url}
              onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Nível de Fofura: {formData.cuteness_level}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.cuteness_level}
              onChange={(e) => setFormData({ ...formData, cuteness_level: parseInt(e.target.value) })}
              className="slider"
            />
          </div>

          <button type="submit" className="btn-primary btn-block">
            🐾 Registrar Pet
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PetPassport;
