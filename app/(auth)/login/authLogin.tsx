'use client';

import { useState } from 'react';
import './login.css';
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/app/features/AuthApi';
import { toast } from 'sonner'
import ButtonLoader from '@/app/components/button/button';

export default function AuthLogin() {
  const router = useRouter()
  // const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [show , setShow] = useState(false)
  const[login , {isLoading}] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { error },
  } = useForm()

  const handleLogin = async(data) => {
   try{
    const res = await login(data).unwrap()
    // localStorage.setItem('accessToken' , res.accessToken);
    // localStorage.setItem("refreshToken", res.refreshToken);
    if(res?.status){
      toast.success("login successfully")
      // localStorage.setItem("accessToken" , res.accessToken)
      // localStorage.setItem("refreshToken", res.refreshToken);
      router.push('/dashboard')
    }
   }catch(err){
         toast.error(err?.data?.message || err.message || "Something went wrong")
   }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Card */}
        <div className="auth-card">
          {/* Header (now inside the card) */}
          <div className="auth-header">
            <div className="auth-logo">
              <span>✦</span>
            </div>
            <h1 className="auth-title">Nexus Chat</h1>
          </div>

         

          {/* Login Form */}
          <form onSubmit={handleSubmit(handleLogin)} className="auth-form">
            {/* Email Input */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id='email'
                  placeholder="david@workspace.com"
                  className="form-input"
                  {...register('email')}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" style={{ margin: 0 }}>
                  Password
                </label>
                <a href="#" className="forgot-password">
                  Forgot Password?
                </a>
              </div>
              <div className="input-wrapper">
                <input
                  type={show ? 'text' : 'password'}
                  id='password'
                  placeholder="••••••••"
                  className="form-input"
                  {...register('password')}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShow(!show)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {show ? (
                    <Eye size={18} strokeWidth={2} />
                  ) : (
                    <EyeOff size={18} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="login-btn">
              {isLoading ? (
                                <>
                                <ButtonLoader />
                               
                                </>
                              ) : (
                                "Login"
                              )}
              <span className="btn-arrow">→</span>
            </button>
          </form>

          {/* Divider */}
          <div className="divider-wrapper">
            <div className="divider-line"></div>
            <span className="divider-text">OR CONTINUE WITH</span>
            <div className="divider-line"></div>
          </div>

          {/* Social Buttons */}
         <div className="social-buttons">
  <button className="social-btn"
  type="button"
  disabled={isGoogleLoading}
>
    <FcGoogle className="social-icon" />
    {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
  </button>

  <button className="social-btn">
    <FaApple className="social-icon" />
    {isAppleLoading ? 'Signing in...' : 'Sign in with Apple'}
  </button>
</div>

          {/* Sign Up Link */}
          <div className="signup-wrapper">
            Don't have an account?{' '}
            <a href="/signup" className="signup-link">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}