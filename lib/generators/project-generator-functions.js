// Additional functions for the ACUL CLI prototype generator

// Generate debug panel - critical for ACUL development
async function generateDebugPanel(projectPath) {
  const componentsDir = path.join(projectPath, 'src', 'components');
  await fs.ensureDir(componentsDir);
  
  const debugPanelContent = `import React, { useState } from 'react';

const DebugPanel = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  if (!context) return null;
  
  return (
    <div className="debug-panel">
      <button 
        onClick={togglePanel}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 9999,
          padding: '8px 12px',
          background: '#0056b3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isOpen ? 'Hide Debug Panel' : 'Show Debug Panel'}
      </button>
      
      {isOpen && (
        <div 
          className="debug-content"
          style={{
            position: 'fixed',
            bottom: '50px',
            right: '10px',
            width: '400px',
            maxHeight: '500px',
            overflowY: 'auto',
            background: '#f0f0f0',
            border: '1px solid #ccc',
            padding: '15px',
            zIndex: 9999,
            borderRadius: '4px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)'
          }}
        >
          <h3>Auth0 ACUL Context</h3>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontSize: '12px',
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '10px',
              borderRadius: '4px',
              overflowX: 'auto'
            }}
          >
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;`;

  await fs.writeFile(path.join(componentsDir, 'DebugPanel.jsx'), debugPanelContent);
}

// Generate utility functions
async function generateUtilFunctions(projectPath) {
  const utilsDir = path.join(projectPath, 'src', 'utils');
  await fs.ensureDir(utilsDir);
  
  // Auth utilities
  const authUtilsContent = `// Authentication utilities for Auth0 ACUL

/**
 * Validates an email address format
 */
export const validateEmail = (email) => {
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return re.test(email);
};

/**
 * Validates password strength
 */
export const validatePassword = (password) => {
  // At least 8 characters with uppercase, lowercase, and number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/;
  return re.test(password);
};

/**
 * Formats error messages from Auth0 response
 */
export const formatError = (error) => {
  if (!error) return '';
  
  if (typeof error === 'string') return error;
  
  if (error.error_description) return error.error_description;
  if (error.message) return error.message;
  
  return 'An unknown error occurred';
};`;

  // Mock ACUL service for local development
  const mockServiceContent = `// Mock Auth0 ACUL service for local development
export class MockAculService {
  constructor() {
    this.domain = 'your-tenant.auth0.com';
    this.clientId = 'your-client-id';
  }
  
  getContext(screenName) {
    // Return mock context based on screen name
    switch(screenName) {
      case 'login-id':
        return this.getLoginContext();
      case 'signup-id':
        return this.getSignupContext();
      case 'password-reset':
        return this.getPasswordResetContext();
      case 'passkey-enrollment':
        return this.getPasskeyContext();
      default:
        return {};
    }
  }
  
  getLoginContext() {
    return {
      screen: {
        name: 'login-id',
        data: {
          alternateLoginMethods: ['google', 'facebook', 'apple'],
          passkey: {
            public_key: {
              challenge: 'mock-challenge-string'
            }
          }
        }
      },
      transaction: {
        state: 'initial',
        lastError: null
      },
      api: {
        authentication: {
          continueWithEmail: (data) => {
            console.log('Mock API call: continueWithEmail', data);
            alert('Continue with email: ' + data.email);
          },
          continueWithProvider: (data) => {
            console.log('Mock API call: continueWithProvider', data);
            alert('Continue with provider: ' + data.provider);
          }
        }
      }
    };
  }
  
  getSignupContext() {
    return {
      screen: {
        name: 'signup-id',
        data: {
          alternateLoginMethods: ['google', 'facebook', 'apple'],
          supportedFields: ['email', 'password', 'name']
        }
      },
      transaction: {
        state: 'initial',
        lastError: null
      },
      api: {
        authentication: {
          continueWithSignup: (data) => {
            console.log('Mock API call: continueWithSignup', data);
            alert('Signup with: ' + JSON.stringify(data));
          },
          continueWithProvider: (data) => {
            console.log('Mock API call: continueWithProvider', data);
            alert('Continue with provider: ' + data.provider);
          }
        }
      }
    };
  }
  
  getPasswordResetContext() {
    return {
      // ... mock password reset context
    };
  }
  
  getPasskeyContext() {
    return {
      // ... mock passkey context
    };
  }
}

export const mockAculService = new MockAculService();`;

  // Write the files
  await fs.writeFile(path.join(utilsDir, 'auth-utils.js'), authUtilsContent);
  await fs.writeFile(path.join(utilsDir, 'mock-acul-service.js'), mockServiceContent);
}

// Login screen components
async function generateLoginScreen(projectPath) {
  const loginDir = path.join(projectPath, 'src', 'screens', 'login-id');
  await fs.ensureDir(loginDir);
  
  // Login screen index.jsx - Main component
  const loginIndexContent = `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import LoginForm from './LoginForm';
import SocialLogins from './SocialLogins';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';
import '../../styles/tailwind.css';

// Login screen component (will be loaded by Auth0 ACUL)
const LoginIdScreen = ({ context }) => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (formData) => {
    // In a real implementation, this would use the Auth0 ACUL SDK to submit
    // For now, we just log the data
    console.log('Login form submitted:', formData);
    if (context && context.api && context.api.authentication) {
      context.api.authentication.continueWithEmail({ email: formData.email });
    }
  };
  
  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
      <LoginForm onSubmit={handleSubmit} />
      <SocialLogins context={context} />
      <DebugPanel context={context} />
    </div>
  );
};

// For Auth0 ACUL integration - this default export is required
export default LoginIdScreen;

// For local development - render the component when loaded directly
if (typeof window !== 'undefined' && document.getElementById('root')) {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement);
  
  // Mock context for local development
  const mockContext = {
    screen: {
      name: 'login-id',
      data: {
        alternateLoginMethods: ['google', 'facebook', 'apple'],
        passkey: {
          public_key: {
            challenge: 'mock-challenge-string'
          }
        }
      }
    },
    transaction: {
      state: 'initial',
      lastError: null
    },
    api: {
      authentication: {
        continueWithEmail: (data) => {
          console.log('Mock API call: continueWithEmail', data);
          alert('Continue with email: ' + data.email);
        }
      }
    }
  };
  
  root.render(<LoginIdScreen context={mockContext} />);
}`;

  // Login form component
  const loginFormContent = `import React, { useState } from 'react';

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    onSubmit({ email });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        {error && <div className="error">{error}</div>}
      </div>
      <button type="submit">Continue</button>
    </form>
  );
};

export default LoginForm;`;

  // Social logins component
  const socialLoginsContent = `import React from 'react';

const SocialLogins = ({ context }) => {
  // Get available social login options from context
  const socialMethods = context?.screen?.data?.alternateLoginMethods || [];
  
  if (socialMethods.length === 0) {
    return null;
  }
  
  const handleSocialLogin = (provider) => {
    console.log(\`Login with \${provider}\`);
    if (context?.api?.authentication?.continueWithProvider) {
      context.api.authentication.continueWithProvider({ provider });
    }
  };
  
  return (
    <div className="social-buttons mt-6">
      <div className="text-center mb-4">or</div>
      {socialMethods.map((provider) => (
        <button
          key={provider}
          type="button"
          className="social-button mb-2"
          onClick={() => handleSocialLogin(provider)}
        >
          Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default SocialLogins;`;

  // Write the files
  await fs.writeFile(path.join(loginDir, 'index.jsx'), loginIndexContent);
  await fs.writeFile(path.join(loginDir, 'LoginForm.jsx'), loginFormContent);
  await fs.writeFile(path.join(loginDir, 'SocialLogins.jsx'), socialLoginsContent);
}

// Generate signup screen components
async function generateSignupScreen(projectPath) {
  const signupDir = path.join(projectPath, 'src', 'screens', 'signup-id');
  await fs.ensureDir(signupDir);
  
  // Signup screen index.jsx
  const signupIndexContent = `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import SignupForm from './SignupForm';
import SocialLogins from './SocialLogins';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';
import '../../styles/tailwind.css';

// Signup screen component (will be loaded by Auth0 ACUL)
const SignupIdScreen = ({ context }) => {
  const handleSubmit = (formData) => {
    // In a real implementation, this would use the Auth0 ACUL SDK to submit
    console.log('Signup form submitted:', formData);
    if (context && context.api && context.api.authentication) {
      context.api.authentication.continueWithSignup(formData);
    }
  };
  
  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
      <SignupForm onSubmit={handleSubmit} />
      <SocialLogins context={context} />
      <DebugPanel context={context} />
    </div>
  );
};

// For Auth0 ACUL integration
export default SignupIdScreen;

// For local development
if (typeof window !== 'undefined' && document.getElementById('root')) {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement);
  
  // Mock context for local development
  const mockContext = {
    screen: {
      name: 'signup-id',
      data: {
        alternateLoginMethods: ['google', 'facebook', 'apple'],
        supportedFields: ['email', 'password', 'name']
      }
    },
    transaction: {
      state: 'initial',
      lastError: null
    },
    api: {
      authentication: {
        continueWithSignup: (data) => {
          console.log('Mock API call: continueWithSignup', data);
          alert('Signup with: ' + JSON.stringify(data));
        }
      }
    }
  };
  
  root.render(<SignupIdScreen context={mockContext} />);
}`;

  // Signup form component
  const signupFormContent = `import React, { useState } from 'react';

const SignupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
        />
        {errors.password && <div className="error">{errors.password}</div>}
      </div>
      
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;`;

  // Copy SocialLogins.jsx from login screen
  const socialLoginsContent = `import React from 'react';

const SocialLogins = ({ context }) => {
  // Get available social login options from context
  const socialMethods = context?.screen?.data?.alternateLoginMethods || [];
  
  if (socialMethods.length === 0) {
    return null;
  }
  
  const handleSocialLogin = (provider) => {
    console.log(\`Signup with \${provider}\`);
    if (context?.api?.authentication?.continueWithProvider) {
      context.api.authentication.continueWithProvider({ provider });
    }
  };
  
  return (
    <div className="social-buttons mt-6">
      <div className="text-center mb-4">or</div>
      {socialMethods.map((provider) => (
        <button
          key={provider}
          type="button"
          className="social-button mb-2"
          onClick={() => handleSocialLogin(provider)}
        >
          Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default SocialLogins;`;

  // Write the files
  await fs.writeFile(path.join(signupDir, 'index.jsx'), signupIndexContent);
  await fs.writeFile(path.join(signupDir, 'SignupForm.jsx'), signupFormContent);
  await fs.writeFile(path.join(signupDir, 'SocialLogins.jsx'), socialLoginsContent);
}

// Generate password reset screen components
async function generatePasswordResetScreen(projectPath) {
  const resetDir = path.join(projectPath, 'src', 'screens', 'password-reset');
  await fs.ensureDir(resetDir);
  
  // Password reset screen index.jsx
  const resetIndexContent = `import React from 'react';
import { createRoot } from 'react-dom/client';
import ResetForm from './ResetForm';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';
import '../../styles/tailwind.css';

// Password reset screen component (will be loaded by Auth0 ACUL)
const PasswordResetScreen = ({ context }) => {
  const handleSubmit = (formData) => {
    console.log('Password reset form submitted:', formData);
    if (context && context.api && context.api.authentication) {
      context.api.authentication.sendResetEmail({ email: formData.email });
    }
  };
  
  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
      <ResetForm onSubmit={handleSubmit} />
      <DebugPanel context={context} />
    </div>
  );
};

// For Auth0 ACUL integration
export default PasswordResetScreen;

// For local development
if (typeof window !== 'undefined' && document.getElementById('root')) {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement);
  
  // Mock context for local development
  const mockContext = {
    screen: {
      name: 'password-reset',
      data: {}
    },
    transaction: {
      state: 'initial',
      lastError: null
    },
    api: {
      authentication: {
        sendResetEmail: (data) => {
          console.log('Mock API call: sendResetEmail', data);
          alert('Password reset email sent to: ' + data.email);
        }
      }
    }
  };
  
  root.render(<PasswordResetScreen context={mockContext} />);
}`;

  // Reset form component
  const resetFormContent = `import React, { useState } from 'react';

const ResetForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    onSubmit({ email });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        {error && <div className="error">{error}</div>}
      </div>
      <p className="text-sm text-gray-600 mb-4">
        We'll send a password reset link to this email address.
      </p>
      <button type="submit">Send Reset Link</button>
    </form>
  );
};

export default ResetForm;`;

  // Write the files
  await fs.writeFile(path.join(resetDir, 'index.jsx'), resetIndexContent);
  await fs.writeFile(path.join(resetDir, 'ResetForm.jsx'), resetFormContent);
}

// Generate passkey enrollment screen components
async function generatePasskeyScreen(projectPath) {
  const passkeyDir = path.join(projectPath, 'src', 'screens', 'passkey-enrollment');
  await fs.ensureDir(passkeyDir);
  
  // Passkey enrollment screen index.jsx
  const passkeyIndexContent = `import React from 'react';
import { createRoot } from 'react-dom/client';
import PasskeyForm from './PasskeyForm';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';
import '../../styles/tailwind.css';

// Passkey enrollment screen component (will be loaded by Auth0 ACUL)
const PasskeyEnrollmentScreen = ({ context }) => {
  const handleEnroll = () => {
    console.log('Enrolling passkey');
    if (context && context.api && context.api.authentication && context.api.authentication.passkey) {
      context.api.authentication.passkey.enrollPasskey()
        .then(() => {
          console.log('Passkey enrolled successfully');
        })
        .catch(error => {
          console.error('Passkey enrollment failed:', error);
        });
    }
  };
  
  const handleSkip = () => {
    console.log('Skipping passkey enrollment');
    if (context && context.api && context.api.authentication) {
      context.api.authentication.skipPasskey();
    }
  };
  
  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-center mb-6">Setup Passkey</h1>
      <PasskeyForm onEnroll={handleEnroll} onSkip={handleSkip} context={context} />
      <DebugPanel context={context} />
    </div>
  );
};

// For Auth0 ACUL integration
export default PasskeyEnrollmentScreen;

// For local development
if (typeof window !== 'undefined' && document.getElementById('root')) {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement);
  
  // Mock context for local development
  const mockContext = {
    screen: {
      name: 'passkey-enrollment',
      data: {
        user: {
          email: 'user@example.com'
        }
      }
    },
    transaction: {
      state: 'passkey_enrollment',
      lastError: null
    },
    api: {
      authentication: {
        passkey: {
          enrollPasskey: () => {
            console.log('Mock API call: enrollPasskey');
            alert('Passkey enrolled successfully');
            return Promise.resolve();
          }
        },
        skipPasskey: () => {
          console.log('Mock API call: skipPasskey');
          alert('Passkey enrollment skipped');
        }
      }
    }
  };
  
  root.render(<PasskeyEnrollmentScreen context={mockContext} />);
}`;

  // Passkey form component
  const passkeyFormContent = `import React from 'react';

const PasskeyForm = ({ onEnroll, onSkip, context }) => {
  const email = context?.screen?.data?.user?.email || 'your account';
  
  return (
    <div>
      <p className="mb-4">
        Add a passkey to {email} for passwordless login.
      </p>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Benefits of Passkeys:</h2>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-1">Faster logins without passwords</li>
          <li className="mb-1">Enhanced security with biometric verification</li>
          <li className="mb-1">Works across your devices</li>
        </ul>
      </div>
      
      <button onClick={onEnroll} className="w-full mb-3">
        Create Passkey
      </button>
      
      <button 
        onClick={onSkip} 
        className="w-full bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        Skip for now
      </button>
    </div>
  );
};

export default PasskeyForm;`;

  // Write the files
  await fs.writeFile(path.join(passkeyDir, 'index.jsx'), passkeyIndexContent);
  await fs.writeFile(path.join(passkeyDir, 'PasskeyForm.jsx'), passkeyFormContent);
}

module.exports = {
  generateDebugPanel,
  generateUtilFunctions,
  generateLoginScreen,
  generateSignupScreen,
  generatePasswordResetScreen,
  generatePasskeyScreen
};
