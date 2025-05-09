# Auth0 ACUL CLI Prototype

This is a prototype CLI tool that demonstrates an improved developer experience for Auth0 Advanced Customization for Universal Login (ACUL).

## Purpose

This prototype showcases how a CLI tool could simplify the ACUL setup process by:

1. Automating project initialization
2. Creating properly configured webpack setup
3. Generating screen boilerplate with proper exports
4. Setting up a local development environment

## How to Use

### Installation

To install and use the prototype:

```bash
npm install -g @auth0/acul-cli
```

Or, for development purposes:

```bash
git clone https://github.com/auth0/acul-cli.git
cd acul-cli
npm install
npm link
```

### Creating a New ACUL Project

```bash
# Initialize a new ACUL project
acul init my-acul-project
```

This will prompt you for various options including:

- Framework selection (currently only React is supported)
- Authentication screens to include
- UI component library selection:
  - None (Tailwind CSS only)
  - Shadcn UI (Tailwind + Radix primitives)
  - Radix UI
  - Chakra UI
  - Material UI
  - Mantine
- Local development mode

### Project Structure

The CLI generates a well-organized project structure with Vite:

```
my-acul-project/
├── package.json           # Project dependencies and scripts
├── vite.config.js         # Vite configuration for modern build pipeline
├── .env                   # Environment variables for Auth0 integration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration for Tailwind
├── public/                # Static assets
├── src/
│   ├── index.js           # Main entry point
│   ├── styles/            # CSS and styling
│   │   └── tailwind.css   # Tailwind entry point
│   ├── components/        # Reusable UI components
│   │   └── debug-panel/   # Debug panel for Auth0 context visualization
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── ui/                # UI component library integration
│   └── screens/           # Auth0 ACUL screens
│       ├── login-id/      # Login screen
│       ├── signup-id/     # Signup screen
│       ├── password-reset/ # Password reset screen
│       └── passkey-enrollment/ # Passkey enrollment screen
```

### Development Workflow

1. Initialize your project:
   ```bash
   acul init my-acul-project
   cd my-acul-project
   npm install    # Important: Always run npm install first
   ```

2. Start the development server with mock Auth0 data:
   ```bash
   npm run acul:dev
   ```

3. Or start the regular development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

### UI Component Libraries

The CLI lets you select from popular UI component libraries to accelerate your ACUL implementation:

- **None (Tailwind CSS only)** - Just uses Tailwind for utility-first styling
- **Shadcn UI** - A collection of accessible components built on Radix UI primitives
- **Radix UI** - Unstyled, accessible components for building high-quality design systems
- **Chakra UI** - A simple, modular and accessible component library
- **Material UI** - Google's Material Design implemented for React
- **Mantine** - A fully featured React components library

When you select a UI library, the CLI automatically:
1. Adds the required dependencies
2. Sets up the necessary configuration
3. Creates starter components to demonstrate usage

## Features

- **Interactive Project Setup**: Guide developers through project creation
- **Proper Screen Templates**: Generate correctly structured screen components
- **Local Development Mode**: Simulate Auth0 environment locally
- **Debug Panel**: Include a debug panel for exploring the Auth0 context
- **Optimized Webpack Configuration**: Automatically configure webpack correctly

## Note

This is a prototype to demonstrate the developer experience. In a full implementation, it would:

1. Connect to Auth0 Management API to fetch tenant configurations
2. Support more frameworks (Vue, Angular, etc.)
3. Include more comprehensive screen templates
4. Provide deployment and tenant configuration utilities

## Benefits

This approach addresses many of the friction points in the current ACUL developer experience:

1. Eliminates confusion about export formats and webpack configuration
2. Streamlines development with hot reloading and local testing
3. Provides properly structured templates for common authentication screens
4. Includes debugging tools out of the box
5. Dramatically reduces the time to get started with ACUL
