import React, { useState } from 'react';
import { User, LogIn, UserPlus, FileText, ArrowRight } from 'lucide-react';
import { authClient } from '../api/authClient.js';
import { User as UserType } from '../../../shared-types/src/index.js';

export type AuthMode = 'login' | 'register';

interface AuthFormProps {
  onSuccess: (user: UserType, mode: AuthMode) => void;
  onError: (msg: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, onError }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Name is required.');
        const session = await authClient.register({ email, password, name });
        onSuccess(session.user, 'register');
      } else {
        const session = await authClient.login({ email, password });
        onSuccess(session.user, 'login');
      }
    } catch (err: any) {
      onError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const session = await authClient.login({
        email: 'demo@example.com',
        password: 'password123'
      });
      // The demo account is pre-seeded, so it is always a returning sign-in.
      onSuccess(session.user, 'login');
    } catch (err: any) {
      onError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-container" className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4 py-12">
      <div id="auth-card" className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100">
            <FileText className="w-5 h-5 text-zinc-200" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Notes App</h1>
            <p className="text-xs text-zinc-400">Simple, secure personal note management</p>
          </div>
        </div>

        <div className="flex border-b border-zinc-800 mb-6">
          <button
            id="tab-login"
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              !isRegister
                ? 'border-zinc-100 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In
          </button>
          <button
            id="tab-register"
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              isRegister
                ? 'border-zinc-100 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Full Name
              </label>
              <input
                id="input-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Email Address
            </label>
            <input
              id="input-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Password
            </label>
            <input
              id="input-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <button
            id="btn-submit-auth"
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-zinc-100 hover:bg-white text-zinc-950 font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isRegister ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-500 mb-3">Want to test right away without creating an account?</p>
          <button
            id="btn-demo-login"
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue as Demo User</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
