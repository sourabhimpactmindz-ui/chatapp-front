'use client'
import { useSignupMutation } from "@/app/features/AuthApi";
import "./sign.css";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";


export default function SignupPage() {
    const [Signup] = useSignupMutation()
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isAppleLoading, setIsAppleLoading] = useState(false);
    const router = useRouter()

    const {
      register,
      handleSubmit,
      formState: {error},
    } = useForm()

    const handleSign = async(data) => {
        try{
            const res = await Signup(data).unwrap()
            localStorage.setItem('accessToken' , res.accessToken);
            localStorage.setItem("refreshToken", res.refreshToken);
            if(res?.status){
      toast.success("SignIn successfully")
      localStorage.setItem("accessToken" , res.accessToken)
      localStorage.setItem("refreshToken", res.refreshToken);
      router.push('/home')
    }
        }catch(error){
          console.log(error)
         toast.error("Invalid")
   }
    }



  return (
    <div className="page-wrapper">
      <div className="signup-container">
        <div className="logo-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="4" r="1.5" fill="#4F46E5" />
            <circle cx="19" cy="8" r="1.5" fill="#4F46E5" />
            <circle cx="19" cy="16" r="1.5" fill="#4F46E5" />
            <circle cx="12" cy="20" r="1.5" fill="#4F46E5" />
            <circle cx="5" cy="16" r="1.5" fill="#4F46E5" />
            <circle cx="5" cy="8" r="1.5" fill="#4F46E5" />
            <circle cx="12" cy="12" r="2" fill="#4F46E5" />
            <line x1="12" y1="4" x2="12" y2="12" stroke="#4F46E5" strokeWidth="1" />
            <line x1="19" y1="8" x2="12" y2="12" stroke="#4F46E5" strokeWidth="1" />
            <line x1="19" y1="16" x2="12" y2="12" stroke="#4F46E5" strokeWidth="1" />
            <line x1="12" y1="20" x2="12" y2="12" stroke="#4F46E5" strokeWidth="1" />
            <line x1="5" y1="16" x2="12" y2="12" stroke="#4F46E5" strokeWidth="1" />
            <line x1="5" y1="8" x2="12" y2="12" stroke="#4F46E5" strokeWidth="1" />
          </svg>
        </div>

        <h1 className="title">Nexus Chat</h1>
        <p className="subtitle">Join the next generation of professional workspace.</p>

        <div className="card">
          <form onSubmit={handleSubmit(handleSign)}>
            <div className="field">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z"
                      fill="#9CA3AF"
                    />
                  </svg>
                </span>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Alex Johnson"
                  {...register('name')}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2 4h20v16H2V4zm2 2v.01L12 12l8-5.99V6H4zm16 2.24l-7.4 5.55a1 1 0 0 1-1.2 0L4 8.24V18h16V8.24z"
                      fill="#9CA3AF"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="name@workspace.com"
                 {...register('email')}
                  required
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V6z"
                        fill="#9CA3AF"
                      />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                  required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="confirmPassword">Confirm</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 4a8 8 0 1 1-8 8H2l3.3-3.3.02.03L8 12H6a6 6 0 1 0 6-6V4z"
                        fill="#9CA3AF"
                      />
                    </svg>
                  </span>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="•••••••"
                    {...register('confirmpassword')}
                  required
                  />
                </div>
              </div>
            </div>

            <div className="terms">
              <input id="terms" type="checkbox" />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </label>
            </div>

            <button type="submit" className="signup-btn"
              disabled={isLoading}
            >
                {isLoading ? 'Sign in...' : 'Sign up'}
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-btn"
            
              
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47c-.28 1.5-1.13 2.77-2.41 3.62v3h3.9c2.28-2.1 3.54-5.2 3.54-8.65z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3c-1.08.72-2.46 1.16-4.03 1.16-3.1 0-5.72-2.09-6.66-4.9H1.32v3.09C3.3 21.3 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.34 14.35a7.2 7.2 0 0 1 0-4.7V6.56H1.32a12 12 0 0 0 0 10.88l4.02-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.34 0 3.3 2.7 1.32 6.56l4.02 3.09C6.28 6.84 8.9 4.75 12 4.75z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button type="button" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#000000"
                    d="M16.36 1.43c0 1.14-.42 2.13-1.26 2.98-.86.86-1.9 1.36-3.03 1.27-.14-1.1.4-2.24 1.24-3.02.85-.8 2.02-1.32 3.05-1.23zM20.6 17.6c-.34.78-.5 1.13-.94 1.82-.61.96-1.47 2.15-2.54 2.16-.95.02-1.2-.62-2.49-.61-1.29.01-1.56.63-2.51.61-1.06-.02-1.88-1.09-2.49-2.05-1.7-2.66-1.89-5.78-.83-7.44.75-1.18 1.94-1.87 3.06-1.87 1.13 0 1.84.62 2.78.62.91 0 1.47-.62 2.78-.62 1 0 2.06.55 2.82 1.5-2.48 1.36-2.08 4.91.36 5.88z"
                  />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            <p className="login-text">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}