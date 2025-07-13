import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState('images/profile.png');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview('images/profile.png');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axios.post('http://localhost:3000/api/auth/signup', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Signup successful! Please log in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Sign Up</h2>
                        {error && <div className="alert alert-error">{error}</div>}
                        <form onSubmit={handleSignup}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Username</span>
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input input-bordered"
                                    required
                                />
                            </div>
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
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Profile Image</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-input file-input-bordered w-full"
                                />
                                <img src={preview} alt="Profile Preview" className="mt-4 w-24 h-24 rounded-full mx-auto" />
                            </div>
                            <div className="card-actions justify-end mt-4">
                                <button type="submit" className="btn btn-primary">Sign Up</button>
                            </div>
                        </form>
                        <p className="mt-4">
                            Already have an account? <Link to="/login" className="link link-primary">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;