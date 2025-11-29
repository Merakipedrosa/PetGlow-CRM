import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Login.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [cpf, setCpf] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                // Create the account
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            birth_date: birthDate,
                            cpf: cpf,
                        }
                    }
                });
                if (signUpError) throw signUpError;

                // Automatically sign in the user
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;

                // User will be redirected automatically by App.jsx session management
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass-panel">
                <div className="login-header">
                    <h1 className="text-gradient logo-lg">PetGlow</h1>
                    <p className="subtitle">Premium Pet CRM</p>
                </div>

                <form onSubmit={handleAuth} className="login-form">
                    {isSignUp && (
                        <>
                            <div className="form-group">
                                <label>Nome Completo</label>
                                <input
                                    type="text"
                                    placeholder="João Silva"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Data de Nascimento</label>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>CPF</label>
                                <input
                                    type="text"
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    maxLength="14"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="admin@petglow.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && <div className="auth-message">{message}</div>}

                    <button type="submit" className="btn-primary btn-block" disabled={loading}>
                        {loading ? 'Carregando...' : isSignUp ? 'Criar Conta' : 'Entrar'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isSignUp ? 'Já tem uma conta?' : "Não tem uma conta?"}
                        <button
                            className="link-btn"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? 'Entrar' : 'Cadastrar'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
