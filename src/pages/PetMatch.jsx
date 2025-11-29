import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './PetMatch.css';

const PetMatch = () => {
    const [pets, setPets] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [swipeDirection, setSwipeDirection] = useState(null);

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
            setPets(data || []);
        } catch (error) {
            console.error('Error fetching pets:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = (direction) => {
        if (currentIndex >= pets.length) return;

        setSwipeDirection(direction);

        setTimeout(() => {
            if (direction === 'right') {
                setMatches([...matches, pets[currentIndex]]);
            }
            setCurrentIndex(currentIndex + 1);
            setSwipeDirection(null);
        }, 300);
    };

    const handleReset = () => {
        setCurrentIndex(0);
        setMatches([]);
    };

    if (loading) {
        return (
            <div className="page-content flex-center">
                <div className="text-xl">Loading Pets... 💕</div>
            </div>
        );
    }

    const currentPet = pets[currentIndex];
    const hasMorePets = currentIndex < pets.length;

    return (
        <div className="page-content">
            <header className="page-header">
                <div>
                    <h2 className="text-2xl font-bold">Pet Match 💕</h2>
                    <p className="text-secondary">Find the perfect playmate for your pet!</p>
                </div>
                <div className="match-stats">
                    <span className="stat-item">
                        <span className="stat-icon">❤️</span>
                        {matches.length} Matches
                    </span>
                    <span className="stat-item">
                        <span className="stat-icon">🐾</span>
                        {pets.length - currentIndex} Remaining
                    </span>
                </div>
            </header>

            <div className="match-container">
                {/* Swipe Cards */}
                <div className="swipe-area">
                    {!hasMorePets ? (
                        <div className="no-more-pets glass-panel">
                            <div className="completion-icon">🎉</div>
                            <h3>No More Pets!</h3>
                            <p>You've seen all available pets.</p>
                            <button className="btn-primary" onClick={handleReset}>
                                Start Over
                            </button>
                        </div>
                    ) : (
                        <div className={`pet-card-stack ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}>
                            {/* Next card (background) */}
                            {pets[currentIndex + 1] && (
                                <div className="pet-card pet-card-next glass-panel">
                                    <div className="pet-card-image">
                                        <img
                                            src={pets[currentIndex + 1].photo_url || 'https://via.placeholder.com/400'}
                                            alt={pets[currentIndex + 1].name}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Current card */}
                            {currentPet && (
                                <div className="pet-card pet-card-current glass-panel">
                                    <div className="pet-card-image">
                                        <img
                                            src={currentPet.photo_url || 'https://via.placeholder.com/400'}
                                            alt={currentPet.name}
                                        />
                                        <div className="pet-card-overlay">
                                            <div className="pet-card-info">
                                                <h2>{currentPet.name}</h2>
                                                <p>{currentPet.breed} • {currentPet.age}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pet-card-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Cuteness</span>
                                            <div className="cuteness-bar">
                                                <div
                                                    className="cuteness-fill"
                                                    style={{ width: `${currentPet.cuteness_level}%` }}
                                                ></div>
                                            </div>
                                            <span className="detail-value">{currentPet.cuteness_level}%</span>
                                        </div>

                                        {currentPet.badges && currentPet.badges.length > 0 && (
                                            <div className="detail-row">
                                                <span className="detail-label">Traits</span>
                                                <div className="traits-list">
                                                    {currentPet.badges.map((badge, index) => (
                                                        <span key={index} className="trait-badge">{badge}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    {hasMorePets && (
                        <div className="swipe-actions">
                            <button
                                className="swipe-btn swipe-btn-nope"
                                onClick={() => handleSwipe('left')}
                                title="Pass"
                            >
                                ✕
                            </button>
                            <button
                                className="swipe-btn swipe-btn-like"
                                onClick={() => handleSwipe('right')}
                                title="Match!"
                            >
                                ❤️
                            </button>
                        </div>
                    )}
                </div>

                {/* Matches Sidebar */}
                <div className="matches-sidebar glass-panel">
                    <h3 className="sidebar-title">
                        <span>Your Matches</span>
                        <span className="match-count">{matches.length}</span>
                    </h3>
                    <div className="matches-list">
                        {matches.length === 0 ? (
                            <p className="empty-message">No matches yet. Start swiping! 💕</p>
                        ) : (
                            matches.map((pet) => (
                                <div key={pet.id} className="match-item">
                                    <img
                                        src={pet.photo_url || 'https://via.placeholder.com/60'}
                                        alt={pet.name}
                                        className="match-photo"
                                    />
                                    <div className="match-info">
                                        <h4>{pet.name}</h4>
                                        <p>{pet.breed}</p>
                                    </div>
                                    <div className="match-icon">💕</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetMatch;
