import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPets: 0,
        activePets: 0,
        checkedInPets: 0,
        totalBookings: 0,
        todayBookings: 0
    });
    const [recentPets, setRecentPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const { data: pets, error: petsError } = await supabase
                .from('pets')
                .select('*')
                .order('created_at', { ascending: false });

            if (petsError) throw petsError;

            const { data: bookings, error: bookingsError } = await supabase
                .from('bookings')
                .select('*');

            if (bookingsError) throw bookingsError;

            const petStatusMap = new Map();
            bookings.forEach(booking => {
                if (booking.pet_id) {
                    petStatusMap.set(booking.pet_id, booking.status);
                }
            });

            const totalPets = pets?.length || 0;
            const activePets = pets?.filter(p => !petStatusMap.has(p.id)).length || 0;
            const checkedInPets = bookings?.length || 0;
            const totalBookings = bookings?.length || 0;

            const today = new Date().toISOString().split('T')[0];
            const todayBookings = bookings?.filter(b => {
                const bookingDate = new Date(b.created_at).toISOString().split('T')[0];
                return bookingDate === today;
            }).length || 0;

            setStats({
                totalPets,
                activePets,
                checkedInPets,
                totalBookings,
                todayBookings
            });

            const recentPetsWithStatus = pets?.slice(0, 5).map(pet => ({
                ...pet,
                realStatus: petStatusMap.has(pet.id) ? 'Checked In' : 'Active'
            })) || [];

            setRecentPets(recentPetsWithStatus);

        } catch (error) {
            console.error('Error fetching dashboard data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-content flex-center">
                <div className="text-xl">Carregando Painel... 📊</div>
            </div>
        );
    }

    return (
        <div className="page-content">
            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon-box rose">
                            <span className="material-icons">group</span>
                        </div>
                        <div className="stat-content">
                            <p className="stat-value">{stats.totalPets}</p>
                            <p className="stat-label">Total de Pets</p>
                        </div>
                    </div>
                    <p className="stat-trend positive">+{stats.activePets} disponíveis</p>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon-box amber">
                            <span className="material-icons">event</span>
                        </div>
                        <div className="stat-content">
                            <p className="stat-value">{stats.todayBookings}</p>
                            <p className="stat-label">Novas Reservas</p>
                        </div>
                    </div>
                    <p className="stat-trend positive">+{stats.todayBookings} hoje</p>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon-box emerald">
                            <span className="material-icons">hotel</span>
                        </div>
                        <div className="stat-content">
                            <p className="stat-value">{stats.checkedInPets}</p>
                            <p className="stat-label">Check-ins</p>
                        </div>
                    </div>
                    <p className="stat-trend positive">Atualmente ativos</p>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon-box indigo">
                            <span className="material-icons">paid</span>
                        </div>
                        <div className="stat-content">
                            <p className="stat-value">{stats.totalBookings}</p>
                            <p className="stat-label">Total de Reservas</p>
                        </div>
                    </div>
                    <p className="stat-trend positive">Todos os tempos</p>
                </div>
            </div>

            {/* Recent Pets Section */}
            <div className="dashboard-section">
                <h3 className="section-title">Pets Recentes</h3>
                <div className="recent-pets-list">
                    {recentPets.length === 0 ? (
                        <p className="empty-message">Nenhum pet cadastrado ainda. Adicione seu primeiro pet! 🐶</p>
                    ) : (
                        recentPets.map((pet) => (
                            <div key={pet.id} className="recent-pet-item">
                                <img
                                    src={pet.photo_url || 'https://via.placeholder.com/50'}
                                    alt={pet.name}
                                    className="recent-pet-photo"
                                />
                                <div className="recent-pet-info">
                                    <h4>{pet.name}</h4>
                                    <p>{pet.breed}</p>
                                </div>
                                <span className={`status-badge ${pet.realStatus === 'Active' ? 'active' : ''}`}>
                                    {pet.realStatus === 'Active' ? 'Ativo' : 'Check-in'}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
