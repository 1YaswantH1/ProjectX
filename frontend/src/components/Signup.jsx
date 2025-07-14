import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState('/images/default-profile.png');
    const [originalImage, setOriginalImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [zoom, setZoom] = useState(1);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;

            img.onload = () => {
                setOriginalImage(img); // Save original image
                processImage(img, zoom, file); // Initial processing
            };

            img.onerror = () => {
                setError("Failed to load image for preview.");
            };
        };

        reader.onerror = () => {
            setError("Failed to read file.");
        };
    };

    const processImage = (img, currentZoom, originalFile) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;

        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        ctx.drawImage(
            img,
            offsetX + (size / 2) * (1 - currentZoom),
            offsetY + (size / 2) * (1 - currentZoom),
            size * currentZoom,
            size * currentZoom,
            0,
            0,
            size,
            size
        );

        canvas.toBlob((blob) => {
            if (!blob) {
                setError("Failed to process image.");
                return;
            }

            const zoomedFile = new File([blob], originalFile?.name || 'profile.jpg', { type: blob.type });
            setProfileImage(zoomedFile);
            setPreview(URL.createObjectURL(blob));
        }, originalFile?.type || 'image/jpeg');
    };

    useEffect(() => {
        if (originalImage) {
            processImage(originalImage, zoom);
        }
    }, [zoom]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            const res = await axios.post('http://localhost:3000/api/auth/signup', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            localStorage.setItem('user', JSON.stringify(res.data.user));
            setSuccess('Signup successful! Redirecting...');
            setTimeout(() => navigate('/'), 1500);
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
                        {success && <div className="alert alert-success">{success}</div>}

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
                                <div className="flex flex-col items-center mt-4">
                                    <div className="overflow-hidden rounded-full border shadow-md w-16 h-16 flex items-center justify-center">
                                        <img
                                            src={preview}
                                            alt="Profile Preview"
                                            className="transition-transform duration-300"
                                            style={{
                                                objectFit: 'cover',
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={zoom}
                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        className="range mt-2 w-24"
                                        title="Zoom"
                                    />
                                </div>
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
