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
                <div className="text-xl">Loading Dashboard... 📊</div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="stats-grid">
                <div className="stat-card pink">
                    <div className="stat-icon">🐾</div>
                    <h3>Total Pets</h3>
                    <p className="stat-value">{stats.totalPets}</p>
                    <span className="stat-trend positive">
                        +{stats.activePets} Available
                    </span>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon">📦</div>
                    <h3>Total Bookings</h3>
                    <p className="stat-value">{stats.totalBookings}</p>
                    <span className="stat-trend neutral">
                        {stats.todayBookings} Today
                    </span>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon">✅</div>
                    <h3>Check-ins</h3>
                    <p className="stat-value">{stats.checkedInPets}</p>
                    <span className="stat-trend positive">Currently</span>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon">👥</div>
                    <h3>Active Pets</h3>
                    <p className="stat-value">{stats.activePets}</p>
                    <span className="stat-trend neutral">Ready to book</span>
                </div>
            </div>

            <div className="dashboard-section">
                <h3 className="section-title">Recent Pets</h3>
                <div className="recent-pets-list">
                    {recentPets.length === 0 ? (
                        <p className="empty-message">No pets registered yet. Add your first pet! 🐶</p>
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
                                    {pet.realStatus}
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
