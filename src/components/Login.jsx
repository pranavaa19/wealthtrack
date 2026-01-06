import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            // Logic handled in App.jsx via onAuthStateChanged
        } catch (err) {
            console.error("Auth Error:", err);
            let msg = "Authentication failed. Please try again.";
            if (err.code === 'auth/invalid-credential') msg = "Invalid email or password.";
            if (err.code === 'auth/email-already-in-use') msg = "Email is already in use.";
            if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-bg-main relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-sidebar-bg opacity-5 -skew-x-12 transform translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-main rounded-full opacity-10 blur-3xl"></div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative z-10 border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-4xl text-sidebar-bg font-bold mb-2">GoldFolio</h1>
                    <p className="text-text-light text-sm">Wealth Management Suite</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-main focus:border-transparent outline-none transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-main focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3 px-4 bg-gold-main hover:bg-gold-dim text-white font-semibold rounded-lg shadow-gold transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <span>Processing...</span> : (
                            <>
                                <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                            }}
                            className="text-sm text-gold-main hover:text-gold-dim font-medium hover:underline"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-text-light">
                        Secure Enterprise Login &copy; 2026 GoldFolio
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
