const fs = require('fs-extra');
const path = require('path');
const { tailwindConfig, postcssConfig } = require('./tailwind-config');
const { viteConfig } = require('./vite-config');

async function generateProject(projectName, options) {
  const projectPath = path.resolve(projectName);
  
  // Create project directory
  await fs.ensureDir(projectPath);
  
  // Create project structure
  await createProjectStructure(projectPath, options);
  
  // Generate package.json
  await generatePackageJson(projectPath, projectName, options);
  
  // Generate Vite config
  await generateViteConfig(projectPath, options);
  
  // Generate ACUL config
  await generateAculConfig(projectPath, options);
  
  // Generate Tailwind CSS config files
  await generateTailwindConfig(projectPath);
  
  // Generate UI library setup if selected
  if (options.uiLibrary !== 'none') {
    await generateUILibrarySetup(projectPath, options);
  }
  
  // Generate screen components
  await generateScreenComponents(projectPath, options);
  
  console.log(`
Project ${projectName} created successfully!
Next steps:
  1. cd ${projectName}
  2. npm install
  3. npm run acul:dev
`);
}

async function createProjectStructure(projectPath, options) {
  // Create directory structure
  const dirs = [
    'src/screens',
    'src/components',
    'src/hooks',
    'src/utils',
    'src/styles',
    'public'
  ];
  
  // Create screen directories based on selection
  if (options.screens.includes('login')) {
    dirs.push('src/screens/login-id');
  }
  
  if (options.screens.includes('signup')) {
    dirs.push('src/screens/signup-id');
  }
  
  if (options.screens.includes('password-reset')) {
    dirs.push('src/screens/password-reset');
  }
  
  if (options.screens.includes('mfa')) {
    dirs.push('src/screens/mfa');
  }
  
  if (options.screens.includes('passwordless')) {
    dirs.push('src/screens/passwordless');
  }
  
  if (options.screens.includes('passkey')) {
    dirs.push('src/screens/passkey-enrollment');
  }
  
  // Create all directories
  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
}

async function generatePackageJson(projectPath, projectName, options) {
  // Base dependencies for all projects
  const dependencies = {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
    '@auth0/auth0-acul-js': '^0.1.0-beta.4'
  };
  
  // Add UI library dependencies based on selection
  switch (options.uiLibrary) {
    case 'shadcn':
      Object.assign(dependencies, {
        'class-variance-authority': '^0.6.0',
        'clsx': '^1.2.1',
        'tailwind-merge': '^1.13.0',
        '@radix-ui/react-dialog': '^1.0.4',
        '@radix-ui/react-slot': '^1.0.2',
        '@radix-ui/react-label': '^2.0.2',
        '@radix-ui/react-checkbox': '^1.0.4'
      });
      break;
    case 'radix':
      Object.assign(dependencies, {
        '@radix-ui/react-dialog': '^1.0.4',
        '@radix-ui/react-form': '^0.0.3',
        '@radix-ui/react-label': '^2.0.2',
        '@radix-ui/react-checkbox': '^1.0.4',
        '@radix-ui/react-slot': '^1.0.2'
      });
      break;
    case 'chakra':
      Object.assign(dependencies, {
        '@chakra-ui/react': '^2.8.0',
        '@emotion/react': '^11.11.0',
        '@emotion/styled': '^11.11.0',
        'framer-motion': '^10.12.16'
      });
      break;
    case 'mui':
      Object.assign(dependencies, {
        '@mui/material': '^5.13.5',
        '@mui/icons-material': '^5.11.16',
        '@emotion/react': '^11.11.0',
        '@emotion/styled': '^11.11.0'
      });
      break;
    case 'mantine':
      Object.assign(dependencies, {
        '@mantine/core': '^6.0.13',
        '@mantine/hooks': '^6.0.13',
        '@mantine/form': '^6.0.13'
      });
      break;
  }
  
  // Set up the package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    type: 'module', // Required for Vite
    scripts: {
      dev: 'vite', // Standard Vite command
      'acul:dev': 'vite --mode acul-dev', // Special mode for ACUL development
      build: 'vite build',
      preview: 'vite preview',
      lint: 'eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0'
    },
    dependencies,
    devDependencies: {
      '@types/react': '^18.0.37',
      '@types/react-dom': '^18.0.11',
      '@vitejs/plugin-react': '^4.0.0',
      'autoprefixer': '^10.4.14',
      'eslint': '^8.38.0',
      'eslint-plugin-react': '^7.32.2',
      'eslint-plugin-react-hooks': '^4.6.0',
      'eslint-plugin-react-refresh': '^0.3.4',
      'postcss': '^8.4.24',
      'prettier': '^2.8.7',
      'tailwindcss': '^3.3.2',
      'vite': '^4.3.9'
    }
  };
  
  await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
}

async function generateViteConfig(projectPath, options) {
  // Create vite.config.js
  await fs.writeFile(path.join(projectPath, 'vite.config.js'), viteConfig);
  
  // Create HTML files for each screen
  const baseHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/acul-logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auth0 ACUL</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>`;

  await fs.writeFile(path.join(projectPath, 'index.html'), baseHtml);
  
  // Create HTML files for each selected screen - using .jsx extension for all React files
  if (options.screens.includes('login')) {
    const loginHtml = baseHtml.replace('/src/index.jsx', '/src/screens/login-id/index.jsx');
    await fs.writeFile(path.join(projectPath, 'login-id.html'), loginHtml);
  }
  
  if (options.screens.includes('signup')) {
    const signupHtml = baseHtml.replace('/src/index.jsx', '/src/screens/signup-id/index.jsx');
    await fs.writeFile(path.join(projectPath, 'signup-id.html'), signupHtml);
  }
  
  if (options.screens.includes('password-reset')) {
    const resetHtml = baseHtml.replace('/src/index.jsx', '/src/screens/password-reset/index.jsx');
    await fs.writeFile(path.join(projectPath, 'password-reset.html'), resetHtml);
  }
  
  if (options.screens.includes('mfa')) {
    const mfaHtml = baseHtml.replace('/src/index.jsx', '/src/screens/mfa/index.jsx');
    await fs.writeFile(path.join(projectPath, 'mfa.html'), mfaHtml);
  }
  
  if (options.screens.includes('passwordless')) {
    const passwordlessHtml = baseHtml.replace('/src/index.jsx', '/src/screens/passwordless/index.jsx');
    await fs.writeFile(path.join(projectPath, 'passwordless.html'), passwordlessHtml);
  }
  
  if (options.screens.includes('passkey')) {
    const passkeyHtml = baseHtml.replace('/src/index.jsx', '/src/screens/passkey-enrollment/index.jsx');
    await fs.writeFile(path.join(projectPath, 'passkey-enrollment.html'), passkeyHtml);
  }
  
  // Create a .env file for mode configuration
  const envContent = `# Auth0 ACUL Configuration
# Use this file to configure your Auth0 tenant settings
# For local development with mock data, run with npm run acul:dev

# Auth0 Tenant Information
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id

# ACUL Mock Mode
VITE_ACUL_MOCK=${options.localDev ? 'true' : 'false'}
`;
  
  await fs.writeFile(path.join(projectPath, '.env'), envContent);
  
  // Create public folder with logo
  await fs.ensureDir(path.join(projectPath, 'public'));
  
  // Create an SVG logo for the project
  const logoSvg = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="8" fill="#EB5424"/>
    <path d="M32 16L16 48H48L32 16Z" fill="white"/>
  </svg>`;
  
  await fs.writeFile(path.join(projectPath, 'public', 'acul-logo.svg'), logoSvg);
}

module.exports = {
  generateProject
};
async function generateAculConfig(projectPath, options) {
  const aculConfig = `// Auth0 ACUL Configuration
export default {
  screens: {
    ${options.screens.includes('login') ? "'login-id': { js: 'login-id.js', css: 'login-id.css' }," : ''}
    ${options.screens.includes('signup') ? "'signup-id': { js: 'signup-id.js', css: 'signup-id.css' }," : ''}
    ${options.screens.includes('password-reset') ? "'password-reset': { js: 'password-reset.js', css: 'password-reset.css' }," : ''}
    ${options.screens.includes('mfa') ? "'mfa': { js: 'mfa.js', css: 'mfa.css' }," : ''}
    ${options.screens.includes('passwordless') ? "'passwordless': { js: 'passwordless.js', css: 'passwordless.css' }," : ''}
    ${options.screens.includes('passkey') ? "'passkey-enrollment': { js: 'passkey-enrollment.js', css: 'passkey-enrollment.css' }," : ''}
  },
  mockData: ${options.localDev ? 'true' : 'false'}
};`;

  await fs.writeFile(path.join(projectPath, 'acul.config.js'), aculConfig);
}

async function generateTailwindConfig(projectPath) {
  // Write tailwind.config.js
  await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);
  
  // Write postcss.config.js - make sure to include tailwindcss plugin
  await fs.writeFile(path.join(projectPath, 'postcss.config.js'), postcssConfig);
  
  // Create a base CSS file with Tailwind directives
  const tailwindCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles below */
`;
  
  await fs.writeFile(path.join(projectPath, 'src', 'styles', 'tailwind.css'), tailwindCss);

  // Create a basic CSS file for non-Tailwind styles
  const basicCss = `/* Basic styles for Auth0 ACUL */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 50px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #0059c1;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #003f87;
}

.error {
  color: red;
  margin-top: 10px;
}

.social-buttons {
  margin-top: 20px;
}

.social-button {
  background-color: #f5f5f5;
  color: #333;
  margin-bottom: 10px;
}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'styles', 'basic.css'), basicCss);
}

async function generateUILibrarySetup(projectPath, options) {
  // Create basic structure for UI library integration
  const uiLibPath = path.join(projectPath, 'src', 'ui');
  await fs.ensureDir(uiLibPath);
  
  // Add appropriate UI setup based on selection
  // This will be implemented based on the UI library choice
  console.log(`Setting up ${options.uiLibrary} UI library...`);
  
  // We'll just create a placeholder for now as this is batch 2
  const readmeTxt = `# UI Library: ${options.uiLibrary}

This directory contains components from the ${options.uiLibrary} UI library.
These components are used across the Auth0 ACUL screens.
`;

  await fs.writeFile(path.join(uiLibPath, 'README.md'), readmeTxt);
}

// Debug panel component for visualizing Auth0 context
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

// Utility functions for Auth0 ACUL
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
};

export const mockAculService = new MockAculService();`;

  // Write the files
  await fs.writeFile(path.join(utilsDir, 'auth-utils.js'), authUtilsContent);
  await fs.writeFile(path.join(utilsDir, 'mock-acul-service.js'), mockServiceContent);
}

// Simplified Login Screen Generator
async function generateSimpleLoginScreen(projectPath) {
  const screensDir = path.join(projectPath, 'src', 'screens', 'login-id');
  await fs.ensureDir(screensDir);
  
  const loginScreenContent = `import React, { useState } from 'react';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';

// This component will be loaded by Auth0 ACUL
const LoginIdScreen = ({ context }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    console.log('Continuing with email:', email);
    if (context?.api?.authentication?.continueWithEmail) {
      context.api.authentication.continueWithEmail({ email });
    }
  };

  const handleSocialLogin = (provider) => {
    console.log('Login with provider:', provider);
    if (context?.api?.authentication?.continueWithProvider) {
      context.api.authentication.continueWithProvider({ provider });
    }
  };

  const socialMethods = context?.screen?.data?.alternateLoginMethods || ['google', 'facebook'];

  return (
    <div className="container">
      <h1>Log In</h1>
      
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
      
      <div className="social-logins">
        <div className="divider">OR</div>
        {socialMethods.map((provider) => (
          <button
            key={provider}
            onClick={() => handleSocialLogin(provider)}
            className="social-button"
          >
            Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Debug panel for inspecting Auth0 context */}
      <DebugPanel context={context} />
    </div>
  );
};

// CRITICAL: export in the format Auth0 ACUL expects
export default LoginIdScreen;

// For local development
if (typeof window !== 'undefined' && document.getElementById('root')) {
  // Import React DOM and mock service for local development
  import('react-dom/client').then(({ createRoot }) => {
    import('../../utils/mock-acul-service').then(({ mockAculService }) => {
      const rootElement = document.getElementById('root');
      const root = createRoot(rootElement);
      
      // Get mock context for this screen
      const mockContext = mockAculService.getContext('login-id');
      
      root.render(<LoginIdScreen context={mockContext} />);
    });
  });
}`;

  await fs.writeFile(path.join(screensDir, 'index.jsx'), loginScreenContent);
}

// Simplified Signup Screen Generator
async function generateSimpleSignupScreen(projectPath) {
  const screensDir = path.join(projectPath, 'src', 'screens', 'signup-id');
  await fs.ensureDir(screensDir);
  
  const signupScreenContent = `import React, { useState } from 'react';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';

// This component will be loaded by Auth0 ACUL
const SignupIdScreen = ({ context }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      console.log('Signup with:', formData);
      if (context?.api?.authentication?.continueWithSignup) {
        context.api.authentication.continueWithSignup(formData);
      }
    }
  };

  const handleSocialLogin = (provider) => {
    console.log('Signup with provider:', provider);
    if (context?.api?.authentication?.continueWithProvider) {
      context.api.authentication.continueWithProvider({ provider });
    }
  };

  const socialMethods = context?.screen?.data?.alternateLoginMethods || ['google', 'facebook'];

  return (
    <div className="container">
      <h1>Sign Up</h1>
      
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
      
      <div className="social-logins">
        <div className="divider">OR</div>
        {socialMethods.map((provider) => (
          <button
            key={provider}
            onClick={() => handleSocialLogin(provider)}
            className="social-button"
          >
            Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Debug panel for inspecting Auth0 context */}
      <DebugPanel context={context} />
    </div>
  );
};

// CRITICAL: export in the format Auth0 ACUL expects
export default SignupIdScreen;

// For local development 
if (typeof window !== 'undefined' && document.getElementById('root')) {
  import('react-dom/client').then(({ createRoot }) => {
    import('../../utils/mock-acul-service').then(({ mockAculService }) => {
      const rootElement = document.getElementById('root');
      const root = createRoot(rootElement);
      const mockContext = mockAculService.getContext('signup-id');
      root.render(<SignupIdScreen context={mockContext} />);
    });
  });
}`;

  await fs.writeFile(path.join(screensDir, 'index.jsx'), signupScreenContent);
}

// Simplified Password Reset Screen Generator
async function generateSimplePasswordResetScreen(projectPath) {
  const screensDir = path.join(projectPath, 'src', 'screens', 'password-reset');
  await fs.ensureDir(screensDir);
  
  const resetScreenContent = `import React, { useState } from 'react';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';

// This component will be loaded by Auth0 ACUL
const PasswordResetScreen = ({ context }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    console.log('Password reset for:', email);
    if (context?.api?.authentication?.resetPassword) {
      context.api.authentication.resetPassword({ email });
    }
  };

  return (
    <div className="container">
      <h1>Reset Your Password</h1>
      
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
        <p className="help-text">
          We'll send you a link to reset your password.
        </p>
        <button type="submit">Send Reset Link</button>
      </form>
      
      {/* Debug panel for inspecting Auth0 context */}
      <DebugPanel context={context} />
    </div>
  );
};

// CRITICAL: export in the format Auth0 ACUL expects
export default PasswordResetScreen;

// For local development
if (typeof window !== 'undefined' && document.getElementById('root')) {
  import('react-dom/client').then(({ createRoot }) => {
    import('../../utils/mock-acul-service').then(({ mockAculService }) => {
      const rootElement = document.getElementById('root');
      const root = createRoot(rootElement);
      const mockContext = mockAculService.getContext('password-reset');
      root.render(<PasswordResetScreen context={mockContext} />);
    });
  });
}`;

  await fs.writeFile(path.join(screensDir, 'index.jsx'), resetScreenContent);
}

// Simplified Passkey Enrollment Screen Generator
async function generateSimplePasskeyScreen(projectPath) {
  const screensDir = path.join(projectPath, 'src', 'screens', 'passkey-enrollment');
  await fs.ensureDir(screensDir);
  
  const passkeyScreenContent = `import React from 'react';
import DebugPanel from '../../components/DebugPanel';
import '../../styles/basic.css';

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
    <div className="container">
      <h1>Set Up Passkey</h1>
      
      <div className="benefits-list">
        <h2>Benefits of Passkeys:</h2>
        <ul>
          <li>Log in without typing passwords</li>
          <li>Use your fingerprint, face, or device PIN</li>
          <li>More secure than traditional passwords</li>
          <li>Works across all your devices</li>
        </ul>
      </div>
      
      <div className="action-buttons">
        <button onClick={handleEnroll} className="primary-button">
          🔑 Create Passkey
        </button>
        
        <button onClick={handleSkip} className="secondary-button">
          Skip for now
        </button>
      </div>
      
      {/* Debug panel for inspecting Auth0 context */}
      <DebugPanel context={context} />
    </div>
  );
};

// CRITICAL: export in the format Auth0 ACUL expects
export default PasskeyEnrollmentScreen;

// For local development
if (typeof window !== 'undefined' && document.getElementById('root')) {
  import('react-dom/client').then(({ createRoot }) => {
    import('../../utils/mock-acul-service').then(({ mockAculService }) => {
      const rootElement = document.getElementById('root');
      const root = createRoot(rootElement);
      const mockContext = mockAculService.getContext('passkey-enrollment');
      root.render(<PasskeyEnrollmentScreen context={mockContext} />);
    });
  });
}`;

  await fs.writeFile(path.join(screensDir, 'index.jsx'), passkeyScreenContent);
}

async function generateScreenComponents(projectPath, options) {
  // Generate a debug panel component first (critical for ACUL development)
  await generateDebugPanel(projectPath);
  
  // Generate utility functions
  await generateUtilFunctions(projectPath);

  // For now, we'll use simplified screen generators
  if (options.screens.includes('login')) {
    await generateSimpleLoginScreen(projectPath);
  }
  
  if (options.screens.includes('signup')) {
    await generateSimpleSignupScreen(projectPath);
  }
  
  if (options.screens.includes('password-reset')) {
    await generateSimplePasswordResetScreen(projectPath);
  }
  
  if (options.screens.includes('passkey')) {
    await generateSimplePasskeyScreen(projectPath);
  }
  
  // Create the main index.jsx file
  const indexJsx = `import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/basic.css';
import './styles/tailwind.css';

// This is the main entry point for local development
// Auth0 ACUL will use individual screen components

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Auth0 ACUL Development Environment</h1>
      </header>
      <main>
        <p className="mb-4">This is a development environment for your Auth0 ACUL screens.</p>
        <p className="mb-4">Auth0 will directly load your screen components when deployed.</p>
        <h2 className="text-xl font-semibold mb-2">Available Screens:</h2>
        <ul className="list-disc pl-6">
          ${options.screens.includes('login') ? '<li className="mb-2"><a href="/login-id.html" className="text-blue-500 hover:underline">Login Screen</a></li>' : ''}
          ${options.screens.includes('signup') ? '<li className="mb-2"><a href="/signup-id.html" className="text-blue-500 hover:underline">Signup Screen</a></li>' : ''}
          ${options.screens.includes('password-reset') ? '<li className="mb-2"><a href="/password-reset.html" className="text-blue-500 hover:underline">Password Reset Screen</a></li>' : ''}
          ${options.screens.includes('mfa') ? '<li className="mb-2"><a href="/mfa.html" className="text-blue-500 hover:underline">MFA Screen</a></li>' : ''}
          ${options.screens.includes('passwordless') ? '<li className="mb-2"><a href="/passwordless.html" className="text-blue-500 hover:underline">Passwordless Screen</a></li>' : ''}
          ${options.screens.includes('passkey') ? '<li className="mb-2"><a href="/passkey-enrollment.html" className="text-blue-500 hover:underline">Passkey Enrollment Screen</a></li>' : ''}
        </ul>
      </main>
    </div>
  );
};

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'index.jsx'), indexJsx);
}
