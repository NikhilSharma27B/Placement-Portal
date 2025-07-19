import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import "../custom.css";

// Add keyframe animation for spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.innerHTML = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // handleSubmit function is defined below


  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password);
      }

      // Redirect based on user type
      if (userType === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/tpo-dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Add a class to the body to ensure full-page styling
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
      {/* Left side - Illustration/Info */}
      <div className="md:flex md:w-1/2 bg-gradient-to-br from-primary-600 to-secondary-600 text-white p-12 flex-col justify-between" 
           style={{display: 'flex', width: '50%', background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)', color: 'white', padding: '3rem', flexDirection: 'column', justifyContent: 'space-between'}}>
        <div>
          <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>Placement Portal</h1>
          <p style={{fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9}}>Your gateway to career opportunities and professional growth</p>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem'}}>
            <div style={{background: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem', borderRadius: '0.5rem'}}>
              <svg style={{height: '1.5rem', width: '1.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 style={{fontWeight: '600', fontSize: '1.125rem'}}>Find Opportunities</h3>
              <p style={{opacity: 0.8}}>Access job listings from top companies</p>
            </div>
          </div>
          
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem'}}>
            <div style={{background: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem', borderRadius: '0.5rem'}}>
              <svg style={{height: '1.5rem', width: '1.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 style={{fontWeight: '600', fontSize: '1.125rem'}}>Resume Management</h3>
              <p style={{opacity: 0.8}}>Upload and manage your professional profile</p>
            </div>
          </div>
          
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem'}}>
            <div style={{background: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem', borderRadius: '0.5rem'}}>
              <svg style={{height: '1.5rem', width: '1.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 style={{fontWeight: '600', fontSize: '1.125rem'}}>Company Profiles</h3>
              <p style={{opacity: 0.8}}>Learn about potential employers</p>
            </div>
          </div>
        </div>
        
        <div style={{paddingTop: '3rem', fontSize: '0.875rem', opacity: 0.7}}>
          © {new Date().getFullYear()} Placement Portal. All rights reserved.
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.9)'}}>

        <div style={{width: '100%', maxWidth: '450px', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)'}}>
          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.75rem'}}>
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p style={{fontSize: '0.95rem', color: '#64748b'}}>
              {isSignUp ? "Join our platform to access opportunities" : "Sign in to access your account"}
            </p>
          </div>

          {error && (
            <div style={{background: '#fee2e2', borderLeft: '4px solid #ef4444', padding: '1rem', marginBottom: '1.5rem', borderRadius: '0.25rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <svg style={{height: '1.25rem', width: '1.25rem', color: '#ef4444', marginRight: '0.75rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{fontSize: '0.95rem', color: '#b91c1c'}}>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                I am a
              </label>
              <div style={{display: 'flex', gap: '1rem'}}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: `2px solid ${userType === "student" ? '#3b82f6' : '#e2e8f0'}`,
                    background: userType === "student" ? '#eff6ff' : 'white',
                    color: userType === "student" ? '#1d4ed8' : '#4b5563',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => setUserType("student")}
                >
                  <svg style={{height: '1.25rem', width: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: `2px solid ${userType === "tpo" ? '#3b82f6' : '#e2e8f0'}`,
                    background: userType === "tpo" ? '#eff6ff' : 'white',
                    color: userType === "tpo" ? '#1d4ed8' : '#4b5563',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => setUserType("tpo")}
                >
                  <svg style={{height: '1.25rem', width: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>TPO</span>
                </button>
              </div>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Email Address
              </label>
              <div style={{position: 'relative'}}>
                <div style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem', pointerEvents: 'none'}}>
                  <svg style={{height: '1.25rem', width: '1.25rem', color: '#9ca3af'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '0.75rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    outline: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Password
              </label>
              <div style={{position: 'relative'}}>
                <div style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem', pointerEvents: 'none'}}>
                  <svg style={{height: '1.25rem', width: '1.25rem', color: '#9ca3af'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    outline: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '0.75rem'}}>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af'}}
                  >
                    {showPassword ? (
                      <svg style={{height: '1.25rem', width: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg style={{height: '1.25rem', width: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div style={{marginTop: '1rem'}}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                {isLoading ? (
                  <>
                    <svg style={{animation: 'spin 1s linear infinite', marginRight: '0.75rem', height: '1.25rem', width: '1.25rem'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </>
                ) : (
                  <>{isSignUp ? "Create Account" : "Sign In"}</>
                )}
              </button>
            </div>

            <div style={{textAlign: 'center', marginTop: '0.75rem'}}>
              <button
                type="button"
                style={{
                  color: '#2563eb',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease'
                }}
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;