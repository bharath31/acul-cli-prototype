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

async function generateScreenComponents(projectPath, options) {
  // We'll implement this in batch 3
  console.log('Generating screen components...');
  
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
