'use client';

import { useState } from 'react';
import './sign.css';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, Mail, Lock, User, MessageCircle, Check, Hash, Paperclip } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSignupMutation } from '@/app/features/AuthApi';
import ButtonLoader from '@/app/components/button/button';

// 0-4 based on length and character variety
const getStrength = (pw = '') => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

export default function SignupPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const strength = getStrength(watch('password'));

  const handleSign = async (data) => {
    try {
      const { terms, ...payload } = data;
      const res = await signup(payload).unwrap();
      if (res?.status) {
        toast.success('Account created. Please sign in.');
        router.push('/login');
      }
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Could not create account');
    }
  };

  return (
    <div className="su-page">
      <div className="su-card">
        {/* ===== Left: form ===== */}
        <section className="su-form-side">
          <a href="/" className="su-logo">
            <span className="su-logo-icon"><MessageCircle size={18} fill="#fff" /></span>
            ChatWave
          </a>

          <h1 className="su-title">Create your account</h1>
          <p className="su-sub">
            Already registered? <a href="/login">Sign in</a>
          </p>

          <div className="su-social">
            <button type="button"><FcGoogle size={18} /> Google</button>
            <button type="button"><FaApple size={18} /> Apple</button>
          </div>

          <div className="su-or"><span>or use your email</span></div>

          <form onSubmit={handleSubmit(handleSign)} noValidate>
            <div className="su-field">
              <label htmlFor="name">Full name</label>
              <div className="su-input">
                <User size={16} />
                <input
                  id="name"
                  type="text"
                  placeholder="Alex Johnson"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  {...register('name', { required: 'Enter your full name' })}
                />
              </div>
              {errors.name && <p className="su-error">{errors.name.message}</p>}
            </div>

            <div className="su-field">
              <label htmlFor="email">Work email</label>
              <div className="su-input">
                <Mail size={16} />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register('email', { required: 'Enter your email address' })}
                />
              </div>
              {errors.email && <p className="su-error">{errors.email.message}</p>}
            </div>

            <div className="su-field">
              <label htmlFor="password">Password</label>
              <div className="su-input">
                <Lock size={16} />
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...register('password', {
                    required: 'Create a password',
                    minLength: { value: 8, message: 'Use at least 8 characters' },
                  })}
                />
                <button
                  type="button"
                  className="su-eye"
                  onClick={() => setShow(!show)}
                  aria-label={show ? 'Hide passwords' : 'Show passwords'}
                >
                  {show ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>
              <div className="su-meter" data-level={strength} aria-hidden="true">
                <i /><i /><i /><i />
                <span>{STRENGTH_LABELS[strength]}</span>
              </div>
              {errors.password && <p className="su-error">{errors.password.message}</p>}
            </div>

            <div className="su-field">
              <label htmlFor="confirmpassword">Confirm password</label>
              <div className="su-input">
                <Lock size={16} />
                <input
                  id="confirmpassword"
                  type={show ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmpassword}
                  {...register('confirmpassword', {
                    required: 'Confirm your password',
                    validate: (v) => v === getValues('password') || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirmpassword && <p className="su-error">{errors.confirmpassword.message}</p>}
            </div>

            <label className="su-terms">
              <input type="checkbox" {...register('terms', { required: 'Accept the terms to continue' })} />
              <span>
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p className="su-error">{errors.terms.message}</p>}

            <button type="submit" disabled={isLoading} className="su-submit">
              {isLoading ? <ButtonLoader /> : 'Create account'}
            </button>
          </form>
        </section>

        {/* ===== Right: product preview ===== */}
        <aside className="su-preview">
          <div className="su-glow" />
          <h2>Everything your team needs, in one place.</h2>

          <ul className="su-points">
            <li><Check size={14} /> Channels for every team and project</li>
            <li><Check size={14} /> Direct messages and group chats</li>
            <li><Check size={14} /> Share files without leaving the conversation</li>
          </ul>

          <div className="su-mock">
            <div className="su-mock-bar"><Hash size={14} /> design-team</div>

            <div className="su-msg">
              <span className="su-av a">PR</span>
              <div>
                <b>Priya <small>10:42</small></b>
                <p>New onboarding screens are ready for review.</p>
              </div>
            </div>

            <div className="su-msg">
              <span className="su-av b">TS</span>
              <div>
                <b>Thomas <small>10:44</small></b>
                <div className="su-file"><Paperclip size={13} /> onboarding-v3.fig</div>
              </div>
            </div>

            <div className="su-msg me">
              <div>
                <p>Looks great. Shipping it today.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}