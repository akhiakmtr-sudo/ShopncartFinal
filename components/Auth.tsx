import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff, KeyRound, ChevronLeft, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot-password' | 'otp-signup' | 'otp-reset' | 'new-password';

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [view, setView] = useState<AuthView>('login');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  
  // Logic States
  const [showPassword, setShowPassword] = useState(false);

  // Reset error when view changes
  useEffect(() => {
    setError('');
    setSuccessMsg('');
    setOtpInput('');
  }, [view]);

  // --- Handlers ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loggedInUser = await authService.login(email, password);
      onLogin(loggedInUser);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const initiateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.register(name, email, password);
      setView('otp-signup');
      setSuccessMsg(`Confirmation code sent to ${email}`);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const verifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.confirmRegister(email, otpInput);
      setSuccessMsg('Email verified! Please login.');
      setTimeout(() => setView('login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const initiateForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setView('otp-reset');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const verifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // In Cognito flow, you verify the OTP at the same time you provide the new password
    setView('new-password');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.confirmNewPassword(email, otpInput, password);
      setSuccessMsg('Password reset successfully! Please login.');
      setTimeout(() => {
        setView('login');
        setPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- Render Helpers ---

  const renderInput = (
    icon: React.ReactNode, 
    type: string, 
    placeholder: string, 
    value: string, 
    setter: (val: string) => void,
    isPassword = false
  ) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
        required
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );

  const SubmitButton = ({ text }: { text: string }) => (
    <button 
      type="submit" 
      disabled={loading}
      className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95 mt-2 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : text}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative">
        
        {/* Navigation / Header */}
        <div className="mb-8 relative">
          {view === 'login' ? (
            <button 
              onClick={onBack}
              className="absolute -top-2 -left-2 text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button 
              onClick={() => {
                if (view === 'signup' || view === 'forgot-password') setView('login');
                else if (view === 'otp-signup') setView('signup');
                else if (view === 'otp-reset') setView('forgot-password');
                else if (view === 'new-password') setView('otp-reset');
              }}
              className="absolute -top-2 -left-2 text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          
          <div className="text-center pt-2">
            <h2 className="text-2xl font-bold text-gray-800">
              {view === 'login' && 'Welcome Back'}
              {view === 'signup' && 'Create Account'}
              {view === 'forgot-password' && 'Reset Password'}
              {(view === 'otp-signup' || view === 'otp-reset') && 'Verify Email'}
              {view === 'new-password' && 'New Password'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {view === 'login' && 'Login to access your account'}
              {view === 'signup' && 'Sign up to start your journey'}
              {view === 'forgot-password' && 'Enter your email to receive a code'}
              {(view === 'otp-signup' || view === 'otp-reset') && `Enter the code sent to ${email}`}
              {view === 'new-password' && 'Create a strong password'}
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-6 text-center animate-pulse">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-600 text-xs p-3 rounded-lg mb-6 text-center">
            {successMsg}
          </div>
        )}

        {/* --- VIEW: LOGIN --- */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {renderInput(<Mail size={18}/>, "email", "Email Address", email, setEmail)}
            {renderInput(<Lock size={18}/>, "password", "Password", password, setPassword, true)}

            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setView('forgot-password')}
                className="text-xs text-gray-500 hover:text-brand font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <SubmitButton text="Login" />

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account? 
              <button onClick={() => setView('signup')} className="text-brand font-bold hover:underline ml-1">
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* --- VIEW: SIGNUP --- */}
        {view === 'signup' && (
          <form onSubmit={initiateSignup} className="space-y-4">
            {renderInput(<UserIcon size={18}/>, "text", "Full Name", name, setName)}
            {renderInput(<Mail size={18}/>, "email", "Email Address", email, setEmail)}
            {renderInput(<Lock size={18}/>, "password", "Create Password", password, setPassword, true)}

            <SubmitButton text="Sign Up" />

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account? 
              <button onClick={() => setView('login')} className="text-brand font-bold hover:underline ml-1">
                Login
              </button>
            </div>
          </form>
        )}

        {/* --- VIEW: FORGOT PASSWORD --- */}
        {view === 'forgot-password' && (
          <form onSubmit={initiateForgotPassword} className="space-y-4">
            {renderInput(<Mail size={18}/>, "email", "Enter your registered email", email, setEmail)}

            <SubmitButton text="Send Code" />

            <button type="button" onClick={() => setView('login')} className="w-full text-gray-500 text-sm py-2 hover:text-gray-800">
              Cancel
            </button>
          </form>
        )}

        {/* --- VIEW: OTP VERIFICATION --- */}
        {(view === 'otp-signup' || view === 'otp-reset') && (
          <form onSubmit={view === 'otp-signup' ? verifySignupOtp : verifyResetOtp} className="space-y-6">
            <div className="flex justify-center">
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-40 text-center text-3xl tracking-widest py-3 border-b-2 border-brand focus:border-green-600 outline-none font-mono bg-transparent"
                placeholder="XXXXXX"
                autoFocus
              />
            </div>
            
            <p className="text-xs text-center text-gray-500">
              Didn't receive code? 
              <button 
                type="button" 
                onClick={() => authService.resendCode(email)}
                className="text-brand font-bold ml-1 hover:underline"
              >
                Resend
              </button>
            </p>

            <SubmitButton text="Verify Code" />
          </form>
        )}

        {/* --- VIEW: NEW PASSWORD --- */}
        {view === 'new-password' && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            {renderInput(<Lock size={18}/>, "password", "New Password", password, setPassword, true)}
            {renderInput(<KeyRound size={18}/>, "password", "Confirm Password", confirmPassword, setConfirmPassword, true)}

            <SubmitButton text="Update Password" />
          </form>
        )}

      </div>
    </div>
  );
};

export default Auth;