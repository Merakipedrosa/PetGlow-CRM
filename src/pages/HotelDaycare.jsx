import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './HotelDaycare.css';

const initialColumns = {
    checkIn: { id: 'checkIn', title: 'Check-In 🏨', items: [] },
    playtime: { id: 'playtime', title: 'Brincadeira 🎾', items: [] },
    napTime: { id: 'napTime', title: 'Soneca 😴', items: [] },
    grooming: { id: 'grooming', title: 'Spa & Banho 🛁', items: [] },
    ready: { id: 'ready', title: 'Pronto para Buscar 🏠', items: [] }
};

const HotelDaycare = () => {
    const [columns, setColumns] = useState(initialColumns);
    const [availablePets, setAvailablePets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedItem, setDraggedItem] = useState(null);
    const [sourceColumn, setSourceColumn] = useState(null);
    const [isNewBooking, setIsNewBooking] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const { data: pets, error: petsError } = await supabase
                .from('pets')
                .select('*');

            if (petsError) throw petsError;

            const { data: bookings, error: bookingsError } = await supabase
                .from('bookings')
                .select('*');

            if (bookingsError) throw bookingsError;

            const newColumns = { ...initialColumns };
            Object.keys(newColumns).forEach(key => newColumns[key].items = []);

            const bookedPetIds = new Set();

            bookings.forEach(booking => {
                if (newColumns[booking.status]) {
                    newColumns[booking.status].items.push({
                        id: booking.id,
                        name: booking.pet_name,
                        task: booking.task_description,
                        tag: booking.service_type,
                        bookingId: booking.id
                    });
                    if (booking.pet_id) bookedPetIds.add(booking.pet_id);
                }
            });

            const available = pets.filter(pet => !bookedPetIds.has(pet.id)).map(pet => ({
                id: pet.id,
                name: pet.name,
                breed: pet.breed,
                photo_url: pet.photo_url
            }));

            setColumns(newColumns);
            setAvailablePets(available);

        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e, item, source) => {
        setDraggedItem(item);
        setSourceColumn(source);
        setIsNewBooking(source === 'available');
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, targetColumnId) => {
        e.preventDefault();

        if (!draggedItem || !sourceColumn) {
            return;
        }

        if (isNewBooking) {
            try {
                const { error } = await supabase
                    .from('bookings')
                    .insert([{
                        pet_id: draggedItem.id,
                        pet_name: draggedItem.name,
                        service_type: 'Daycare',
                        task_description: 'New booking',
                        status: targetColumnId
                    }]);

                if (error) throw error;
                fetchData();

            } catch (error) {
                console.error('Error creating booking:', error.message);
                alert('Erro ao criar reserva: ' + error.message);
            }
        } else if (sourceColumn !== targetColumnId) {
            const newColumns = { ...columns };
            newColumns[sourceColumn].items = newColumns[sourceColumn].items.filter(
                item => item.id !== draggedItem.id
            );
            newColumns[targetColumnId].items = [...newColumns[targetColumnId].items, draggedItem];
            setColumns(newColumns);

            try {
                const { error } = await supabase
                    .from('bookings')
                    .update({ status: targetColumnId })
                    .eq('id', draggedItem.bookingId);

                if (error) throw error;
            } catch (error) {
                console.error('Error updating booking:', error.message);
                fetchData();
            }
        }

        setDraggedItem(null);
        setSourceColumn(null);
        setIsNewBooking(false);
    };

    const handleDeleteBooking = async (bookingId, e) => {
        e.stopPropagation();

        if (!confirm('Remove this booking?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', bookingId);

            if (error) throw error;
            fetchData();

        } catch (error) {
            console.error('Error deleting booking:', error.message);
            alert('Erro ao remover reserva: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="page-content flex-center">
                <div className="text-xl">Carregando... 🏨</div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <header className="page-header">
                <div>
                    <h2 className="text-2xl font-bold">Hotel & Creche 🏨</h2>
                    <p className="text-secondary">Arraste os pets para as colunas para criar reservas</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={fetchData}>🔄 Atualizar</button>
                </div>
            </header>

            <div className="available-pets-section card">
                <h3 className="section-title">
                    <span>🐾 Pets Disponíveis</span>
                    <span className="count-badge">{availablePets.length}</span>
                </h3>
                <div className="available-pets-list">
                    {availablePets.length === 0 ? (
                        <p className="empty-message">Todos os pets estão reservados! 🎉</p>
                    ) : (
                        availablePets.map((pet) => (
                            <div
                                key={pet.id}
                                className="available-pet-card"
                                draggable
                                onDragStart={(e) => handleDragStart(e, pet, 'available')}
                            >
                                <img
                                    src={pet.photo_url || 'https://via.placeholder.com/40'}
                                    alt={pet.name}
                                    className="available-pet-photo"
                                />
                                <div className="available-pet-info">
                                    <h4>{pet.name}</h4>
                                    <p>{pet.breed}</p>
                                </div>
                                <div className="drag-handle">⋮⋮</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="kanban-board">
                {Object.values(columns).map((column) => (
                    <div
                        key={column.id}
                        className="kanban-column glass-panel"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        <div className="column-header">
                            <h3>{column.title}</h3>
                            <span className="count-badge">{column.items.length}</span>
                        </div>

                        <div className="column-content">
                            {column.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="kanban-card"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item, column.id)}
                                >
                                    <button
                                        className="delete-booking-btn"
                                        onClick={(e) => handleDeleteBooking(item.bookingId, e)}
                                        title="Remove booking"
                                    >
                                        ✕
                                    </button>
                                    <div className="card-header">
                                        <span className="pet-name-sm">{item.name}</span>
                                        <span className={`service-tag ${item.tag.toLowerCase()}`}>{item.tag}</span>
                                    </div>
                                    <p className="card-task">{item.task}</p>
                                    <div className="card-footer">
                                        <div className="avatar-xs">🐶</div>
                                    </div>
                                </div>
                            ))}
                            {column.items.length === 0 && (
                                <div className="empty-state">Solte os pets aqui</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelDaycare;
