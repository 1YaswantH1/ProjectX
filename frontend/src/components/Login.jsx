import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
            alert('Login successful!');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Login</h2>
                        {error && <div className="alert alert-error">{error}</div>}
                        <form onSubmit={handleLogin}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            <div className="card-actions justify-end mt-4">
                                <button type="submit" className="btn btn-primary">Login</button>
                            </div>
                        </form>
                        <p className="mt-4">
                            Don't have an account? <Link to="/signup" className="link link-primary">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;