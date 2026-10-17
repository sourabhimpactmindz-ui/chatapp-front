'use client';

import { useState } from 'react';
import './login.css';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, Mail, Lock, ArrowRight, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/app/features/AuthApi';
import { toast } from 'sonner';
import ButtonLoader from '@/app/components/button/button';
import { connectSocket } from '@/app/services/socket';

export default function AuthLogin() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const { register, handleSubmit } = useForm({ defaultValues: { remember: true } });

  const handleLogin = async (data) => {
    try {
      const res = await login(data).unwrap();
      if (res?.status) {
        connectSocket(res.userid);
        toast.success('Login successfully');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        {/* ===== Left: visual panel ===== */}
        {/* <aside className="login-hero">
          <img className="hero-img" src="/chatappp.jpg" alt="" />
          <div className="hero-overlay" />

          <div className="brand">
            <span className="brand-icon"><MessageCircle size={20} fill="#fff" /></span>
            <span>
              <span className="brand-name">Chat<em>Wave</em></span>
              <span className="brand-tag">CONNECT · CHAT · SHARE</span>
            </span>
          </div>

          <div className="hero-chip">
            <span className="chip-avatar">TS<i /></span>
            <span>
              <strong>Thomas shared a file</strong>
              <small>Just now · Design team</small>
            </span>
          </div>

          <div className="hero-bottom">
            <p className="hero-eyebrow"><i /> BUILT FOR BETTER TEAMWORK</p>
            <blockquote>“Our best work happens when every voice has a place.”</blockquote>
            <div className="hero-author">
              <span className="author-avatar">MM</span>
              <span>
                <strong>Maya Morgan</strong>
                <small>Product Lead at Northstar</small>
              </span>
            </div>
          </div>
        </aside> */}

        {/* ===== Right: form panel ===== */}
        <main className="login-panel">
          <p className="panel-top">
            New to ChatWave? <a href="/signup">Create account</a>
          </p>

          <div className="panel-body">
            <p className="welcome-eyebrow">WELCOME BACK</p>
            <h1 className="panel-title">Sign in to your workspace.</h1>
            <p className="panel-sub">Your conversations are right where you left them.</p>

            <form onSubmit={handleSubmit(handleLogin)} className="login-form">
              <div className="field">
                <label htmlFor="email">Email address</label>
                <div className="input-box">
                  <Mail size={17} className="lead-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="email"
                    {...register('email')}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <a href="#" className="forgot">Forgot password?</a>
                </div>
                <div className="input-box">
                  <Lock size={17} className="lead-icon" />
                  <input
                    id="password"
                    type={show ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    {...register('password')}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShow(!show)}
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <label className="remember">
                <input type="checkbox" {...register('remember')} />
                <span>Remember me for 30 days</span>
              </label>

              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? <ButtonLoader /> : <>Continue to ChatWave <ArrowRight size={16} /></>}
              </button>
            </form>

            <div className="divider"><span>OR SIGN IN WITH</span></div>

            <div className="social-row">
              <button type="button" className="social-btn">
                <FcGoogle size={18} /> Google
              </button>
              <button type="button" className="social-btn">
                <FaApple size={18} /> Apple
              </button>
            </div>
          </div>

          <footer className="panel-foot">
            <span>© 2025 ChatWave</span>
            <span className="foot-links"><a href="#">Privacy</a><a href="#">Help</a></span>
          </footer>
        </main>
      </div>
    </div>
  );
}