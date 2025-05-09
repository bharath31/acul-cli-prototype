// Login screen generation
async function generateLoginScreen(projectPath) {
  const loginDir = path.join(projectPath, 'src', 'screens', 'login-id');
  await fs.ensureDir(loginDir);
  
  // Create component files based on ideal structure
  
  // 1. Main screen component (index.jsx)
  const loginIndexContent = `import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginForm from './LoginForm';
import SocialLogins from './SocialLogins';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';
import '../../styles/tailwind.css';

// This component will be loaded by Auth0 ACUL
const LoginIdScreen = ({ context }) => {
  const handleContinue = (data) => {
    console.log('Continuing with email:', data.email);
    if (context?.api?.authentication?.continueWithEmail) {
      context.api.authentication.continueWithEmail({ email: data.email });
    }
  };

  return (
    <div className="container mx-auto max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
      <LoginForm onSubmit={handleContinue} />
      <SocialLogins context={context} />
      <DebugPanel context={context} />
    </div>
  );
};

// CRITICAL: export in the format Auth0 ACUL expects
// This must be a default export that gets assigned to window.default
export default LoginIdScreen;

// For local development
if (typeof window !== 'undefined' && document.getElementById('root')) {
  // Import mock service in local development only
  import('../../utils/mock-acul-service').then(({ mockAculService }) => {
    const rootElement = document.getElementById('root');
    const root = createRoot(rootElement);
    
    // Get mock context for this screen
    const mockContext = mockAculService.getContext('login-id');
    
    root.render(<LoginIdScreen context={mockContext} />);
  });
}`;

  // 2. LoginForm component
  const loginFormContent = `import React, { useState } from 'react';
import { validateEmail } from '../../utils/auth-utils';

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Clear any errors and submit
    setError('');
    onSubmit({ email });
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="form-group">
        <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {error && <div className="text-red-600 mt-1 text-sm">{error}</div>}
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mt-4"
      >
        Continue
      </button>
    </form>
  );
};

export default LoginForm;`;

  // 3. SocialLogins component
  const socialLoginsContent = `import React from 'react';

const SocialLogins = ({ context }) => {
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
    <div className="social-logins">
      <div className="text-center text-gray-500 my-4">OR</div>
      <div className="space-y-2">
        {socialMethods.map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => handleSocialLogin(provider)}
            className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition flex items-center justify-center"
          >
            Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialLogins;`;

  // Write the files
  await fs.writeFile(path.join(loginDir, 'index.jsx'), loginIndexContent);
  await fs.writeFile(path.join(loginDir, 'LoginForm.jsx'), loginFormContent);
  await fs.writeFile(path.join(loginDir, 'SocialLogins.jsx'), socialLoginsContent);
}

// Signup screen generation
async function generateSignupScreen(projectPath) {
  const signupDir = path.join(projectPath, 'src', 'screens', 'signup-id');
  await fs.ensureDir(signupDir);
  
  // 1. Main component
  const signupIndexContent = `import React from 'react';
import { createRoot } from 'react-dom/client';
import SignupForm from './SignupForm';
import SocialLogins from './SocialLogins';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';
import '../../styles/tailwind.css';

// This component will be loaded by Auth0 ACUL
const SignupIdScreen = ({ context }) => {
  const handleSignup = (data) => {
    console.log('Signup with:', data);
    if (context?.api?.authentication?.continueWithSignup) {
      context.api.authentication.continueWithSignup(data);
    }
  };
  
  return (
    <div className="container mx-auto max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
      <SignupForm onSubmit={handleSignup} />
      <SocialLogins context={context} />
      <DebugPanel context={context} />
    </div>
  );
};

// CRITICAL: export in the format Auth0 ACUL expects
export default SignupIdScreen;

// For local development
if (typeof window !== 'undefined' && document.getElementById('root')) {
  // Import mock service in local development only
  import('../../utils/mock-acul-service').then(({ mockAculService }) => {
    const rootElement = document.getElementById('root');
    const root = createRoot(rootElement);
    
    // Get mock context for this screen
    const mockContext = mockAculService.getContext('signup-id');
    
    root.render(<SignupIdScreen context={mockContext} />);
  });
}`;

  // 2. SignupForm component
  const signupFormContent = `import React, { useState } from 'react';
import { validateEmail, validatePassword } from '../../utils/auth-utils';

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
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must have at least 8 characters with uppercase, lowercase, and a number';
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
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="form-group mb-4">
        <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.name && <div className="text-red-600 mt-1 text-sm">{errors.name}</div>}
      </div>
      
      <div className="form-group mb-4">
        <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.email && <div className="text-red-600 mt-1 text-sm">{errors.email}</div>}
      </div>
      
      <div className="form-group mb-4">
        <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.password && <div className="text-red-600 mt-1 text-sm">{errors.password}</div>}
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mt-4"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;`;

  // 3. SocialLogins component - reuse from login screen
  const socialLoginsContent = `import React from 'react';

const SocialLogins = ({ context }) => {
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
    <div className="social-logins">
      <div className="text-center text-gray-500 my-4">OR</div>
      <div className="space-y-2">
        {socialMethods.map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => handleSocialLogin(provider)}
            className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition flex items-center justify-center"
          >
            Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialLogins;`;

  // Write the files
  await fs.writeFile(path.join(signupDir, 'index.jsx'), signupIndexContent);
  await fs.writeFile(path.join(signupDir, 'SignupForm.jsx'), signupFormContent);
  await fs.writeFile(path.join(signupDir, 'SocialLogins.jsx'), socialLoginsContent);
}

// Password reset screen generation 
async function generatePasswordResetScreen(projectPath) {
  const resetDir = path.join(projectPath, 'src', 'screens', 'password-reset');
  await fs.ensureDir(resetDir);
  
  // Main component
  const resetIndexContent = `import React from 'react';
import { createRoot } from 'react-dom/client';
import ResetForm from './ResetForm';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';
import '../../styles/tailwind.css';

// This component will be loaded by Auth0 ACUL
const PasswordResetScreen = ({ context }) => {
  const handleReset = (data) => {
    console.log('Password reset for email:', data.email);
    if (context?.api?.authentication?.resetPassword) {
      context.api.authentication.resetPassword({ email: data.email });
    }
  };
  
  return (
    <div className="container mx-auto max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Reset Your Password</h1>
      <ResetForm onSubmit={handleReset} />
      <DebugPanel context={context} />
    </div>
  );
};

// CRITICAL: export in the format Auth0 ACUL expects
export default PasswordResetScreen;

// For local development
if (typeof window !== 'undefined' && document.getElementById('root')) {
  // Import mock service in local development only
  import('../../utils/mock-acul-service').then(({ mockAculService }) => {
    const rootElement = document.getElementById('root');
    const root = createRoot(rootElement);
    
    // Get mock context for this screen
    const mockContext = mockAculService.getContext('password-reset');
    
    root.render(<PasswordResetScreen context={mockContext} />);
  });
}`;

  // Reset form component
  const resetFormContent = `import React, { useState } from 'react';
import { validateEmail } from '../../utils/auth-utils';

const ResetForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Clear any errors and submit
    setError('');
    onSubmit({ email });
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="form-group">
        <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {error && <div className="text-red-600 mt-1 text-sm">{error}</div>}
      </div>
      <p className="text-gray-600 text-sm mb-4">
        We'll send you a link to reset your password.
      </p>
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mt-4"
      >
        Send Reset Link
      </button>
    </form>
  );
};

export default ResetForm;`;

  // Write the files
  await fs.writeFile(path.join(resetDir, 'index.jsx'), resetIndexContent);
  await fs.writeFile(path.join(resetDir, 'ResetForm.jsx'), resetFormContent);
}

// Passkey enrollment screen generation
async function generatePasskeyScreen(projectPath) {
  const passkeyDir = path.join(projectPath, 'src', 'screens', 'passkey-enrollment');
  await fs.ensureDir(passkeyDir);
  
  // Main component
  const passkeyIndexContent = `import React from 'react';
import { createRoot } from 'react-dom/client';
import PasskeyForm from './PasskeyForm';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';
import '../../styles/tailwind.css';

// This component will be loaded by Auth0 ACUL
const PasskeyEnrollmentScreen = ({ context }) => {
  const handleEnroll = () => {
    console.log('Enrolling passkey');
    if (context?.api?.authentication?.passkey?.enrollPasskey) {
      context.api.authentication.passkey.enrollPasskey()
        .then(() => {
          console.log('Passkey enrolled successfully');
        })
        .catch(error => {
          console.error('Error enrolling passkey:', error);
        });
    }
  };
  
  const handleSkip = () => {
    console.log('Skipping passkey enrollment');
    if (context?.api?.authentication?.skipPasskey) {
      context.api.authentication.skipPasskey();
    }
  };
  
  return (
    <div className="container mx-auto max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Set Up Passkey</h1>
      <PasskeyForm 
        onEnroll={handleEnroll} 
        onSkip={handleSkip} 
        email={context?.screen?.data?.user?.email} 
      />
      <DebugPanel context={context} />
    </div>
  );
};

// CRITICAL: export in the format Auth0 ACUL expects
export default PasskeyEnrollmentScreen;

// For local development
if (typeof window !== 'undefined' && document.getElementById('root')) {
  // Import mock service in local development only
  import('../../utils/mock-acul-service').then(({ mockAculService }) => {
    const rootElement = document.getElementById('root');
    const root = createRoot(rootElement);
    
    // Get mock context for this screen
    const mockContext = mockAculService.getContext('passkey-enrollment');
    
    root.render(<PasskeyEnrollmentScreen context={mockContext} />);
  });
}`;

  // Passkey form component
  const passkeyFormContent = `import React from 'react';

const PasskeyForm = ({ onEnroll, onSkip, email = 'your account' }) => {
  return (
    <div className="mb-6">
      <p className="text-gray-700 mb-6">
        Add a passkey to <strong>{email}</strong> for faster, more secure sign-in.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-medium text-blue-900 mb-2">Benefits of Passkeys:</h2>
        <ul className="list-disc pl-6 text-blue-800">
          <li className="mb-1">Log in without typing passwords</li>
          <li className="mb-1">Use your fingerprint, face, or device PIN</li>
          <li className="mb-1">More secure than traditional passwords</li>
          <li className="mb-1">Works across all your devices</li>
        </ul>
      </div>
      
      <button 
        onClick={onEnroll}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition mb-3 flex items-center justify-center"
      >
        <span className="mr-2">🔑</span> Create Passkey
      </button>
      
      <button
        onClick={onSkip}
        className="w-full bg-transparent text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition border border-gray-300"
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

// Generate proper linting configuration
async function generateLintingConfig(projectPath) {
  // Create ESLint config
  const eslintConfig = `module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  }
};`;

  // Create Prettier config
  const prettierConfig = `{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid"
}`;

  await fs.writeFile(path.join(projectPath, '.eslintrc.cjs'), eslintConfig);
  await fs.writeFile(path.join(projectPath, '.prettierrc.json'), prettierConfig);
}

module.exports = {
  generateLoginScreen,
  generateSignupScreen,
  generatePasswordResetScreen,
  generatePasskeyScreen,
  generateLintingConfig
};
