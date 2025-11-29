import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Modal from '../components/Modal';
import './Health.css';

const Health = () => {
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [healthRecords, setHealthRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: 'vaccine',
        title: '',
        date: '',
        notes: '',
        next_date: ''
    });

    useEffect(() => {
        fetchPets();
    }, []);

    useEffect(() => {
        if (selectedPet) {
            fetchHealthRecords(selectedPet.id);
        }
    }, [selectedPet]);

    const fetchPets = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('pets')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setPets(data || []);
            if (data && data.length > 0) {
                setSelectedPet(data[0]);
            }
        } catch (error) {
            console.error('Error fetching pets:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchHealthRecords = async (petId) => {
        try {
            const { data, error } = await supabase
                .from('health_records')
                .select('*')
                .eq('pet_id', petId)
                .order('date', { ascending: false });

            if (error) throw error;
            setHealthRecords(data || []);
        } catch (error) {
            console.error('Error fetching health records:', error.message);
        }
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();

        try {
            const { error } = await supabase
                .from('health_records')
                .insert([{
                    pet_id: selectedPet.id,
                    type: formData.type,
                    title: formData.title,
                    date: formData.date,
                    notes: formData.notes,
                    next_date: formData.next_date || null
                }]);

            if (error) throw error;

            fetchHealthRecords(selectedPet.id);
            setFormData({
                type: 'vaccine',
                title: '',
                date: '',
                notes: '',
                next_date: ''
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding record:', error.message);
            alert('Erro ao adicionar registro: ' + error.message);
        }
    };

    const getRecordIcon = (type) => {
        switch (type) {
            case 'vaccine': return '💉';
            case 'checkup': return '🩺';
            case 'medication': return '💊';
            case 'surgery': return '🏥';
            default: return '📋';
        }
    };

    const getRecordColor = (type) => {
        switch (type) {
            case 'vaccine': return 'record-vaccine';
            case 'checkup': return 'record-checkup';
            case 'medication': return 'record-medication';
            case 'surgery': return 'record-surgery';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="page-content flex-center">
                <div className="text-xl">Carregando Registros de Saúde... 🏥</div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <header className="page-header">
                <div>
                    <h2 className="text-2xl font-bold">Saúde 🏥</h2>
                    <p className="text-secondary">Monitore vacinas, checkups & medicamentos</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    + Adicionar Registro
                </button>
            </header>

            <div className="health-container">
                {/* Pet Selector */}
                <div className="pet-selector glass-panel">
                    <h3 className="selector-title">Selecionar Pet</h3>
                    <div className="pet-list">
                        {pets.map((pet) => (
                            <div
                                key={pet.id}
                                className={`pet-item ${selectedPet?.id === pet.id ? 'active' : ''}`}
                                onClick={() => setSelectedPet(pet)}
                            >
                                <img
                                    src={pet.photo_url || 'https://via.placeholder.com/50'}
                                    alt={pet.name}
                                    className="pet-thumb"
                                />
                                <div className="pet-item-info">
                                    <h4>{pet.name}</h4>
                                    <p>{pet.breed}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Health Records */}
                <div className="health-records">
                    {selectedPet && (
                        <div className="selected-pet-header glass-panel">
                            <img
                                src={selectedPet.photo_url || 'https://via.placeholder.com/80'}
                                alt={selectedPet.name}
                                className="selected-pet-photo"
                            />
                            <div className="selected-pet-info">
                                <h3>{selectedPet.name}</h3>
                                <p>{selectedPet.breed} • {selectedPet.age}</p>
                            </div>
                            <div className="health-stats">
                                <div className="stat-box">
                                    <span className="stat-number">{healthRecords.length}</span>
                                    <span className="stat-label">Registros</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="records-timeline">
                        {healthRecords.length === 0 ? (
                            <div className="empty-state glass-panel">
                                <div className="empty-icon">🏥</div>
                                <h3>Nenhum Registro de Saúde</h3>
                                <p>Adicione o primeiro registro para {selectedPet?.name}</p>
                            </div>
                        ) : (
                            healthRecords.map((record) => (
                                <div key={record.id} className={`record-card glass-panel ${getRecordColor(record.type)}`}>
                                    <div className="record-icon">{getRecordIcon(record.type)}</div>
                                    <div className="record-content">
                                        <div className="record-header">
                                            <h4>{record.title}</h4>
                                            <span className="record-type">{record.type}</span>
                                        </div>
                                        <p className="record-date">
                                            📅 {new Date(record.date).toLocaleDateString('pt-BR')}
                                        </p>
                                        {record.notes && (
                                            <p className="record-notes">{record.notes}</p>
                                        )}
                                        {record.next_date && (
                                            <p className="record-next">
                                                🔔 Próximo: {new Date(record.next_date).toLocaleDateString('pt-BR')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add Record Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Registro de Saúde">
                <form onSubmit={handleAddRecord} className="health-form">
                    <div className="form-group">
                        <label>Tipo *</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            <option value="vaccine">💉 Vacina</option>
                            <option value="checkup">🩺 Checkup</option>
                            <option value="medication">💊 Medicamento</option>
                            <option value="surgery">🏥 Cirurgia</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Título *</label>
                        <input
                            type="text"
                            placeholder="ex: Vacina da Raiva"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Data *</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Próxima Data (opcional)</label>
                        <input
                            type="date"
                            value={formData.next_date}
                            onChange={(e) => setFormData({ ...formData, next_date: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Notas (opcional)</label>
                        <textarea
                            placeholder="Informações adicionais..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows="3"
                        />
                    </div>

                    <button type="submit" className="btn-primary btn-block">
                        💾 Salvar Registro
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Health;
