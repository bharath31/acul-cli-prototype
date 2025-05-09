const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { generateProject } = require('../generators/project-generator');

async function initCommand(projectName) {
  console.log(chalk.blue.bold(`\n📦 Creating a new Auth0 ACUL project: ${projectName}\n`));
  
  try {
    // Check if directory exists
    if (fs.existsSync(projectName)) {
      console.log(chalk.yellow(`⚠️  The directory ${projectName} already exists. Please choose a different name or delete the existing directory.`));
      return;
    }
    
    // Prompt for project options
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Which framework would you like to use?',
        choices: [
          { name: 'React', value: 'react' },
          { name: 'Vue (not available in prototype)', value: 'vue', disabled: true },
          { name: 'Angular (not available in prototype)', value: 'angular', disabled: true },
          { name: 'Plain JavaScript (not available in prototype)', value: 'js', disabled: true }
        ],
        default: 'react'
      },
      {
        type: 'checkbox',
        name: 'screens',
        message: 'Which authentication screens do you need?',
        choices: [
          { name: 'Login', value: 'login', checked: true },
          { name: 'Signup', value: 'signup', checked: true },
          { name: 'Password Reset', value: 'password-reset', checked: true },
          { name: 'MFA', value: 'mfa' },
          { name: 'Passwordless', value: 'passwordless' },
          { name: 'Passkey', value: 'passkey', checked: true }
        ],
        validate: (answer) => {
          if (answer.length < 1) {
            return 'You must choose at least one screen.';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'uiLibrary',
        message: 'Which UI component library would you like to use?',
        choices: [
          { name: 'None (Tailwind CSS only)', value: 'none' },
          { name: 'Shadcn UI (Tailwind + Radix primitives)', value: 'shadcn' },
          { name: 'Radix UI', value: 'radix' },
          { name: 'Chakra UI', value: 'chakra' },
          { name: 'Material UI', value: 'mui' },
          { name: 'Mantine', value: 'mantine' }
        ],
        default: 'none'
      },
      {
        type: 'confirm',
        name: 'localDev',
        message: 'Would you like to enable local development mode?',
        default: true
      }
    ]);
    
    // Generate project files
    const spinner = ora('Generating project files...').start();
    
    await generateProject(projectName, answers);
    
    spinner.succeed('Project files generated!');
    
    // Display success message and next steps
    console.log(`\n${chalk.green.bold('Success!')} Created ${chalk.blue.bold(projectName)} at ${chalk.blue.bold(path.resolve(projectName))}\n`);
    console.log('Inside that directory, you can run several commands:');
    console.log(`\n  ${chalk.cyan('npm start')}`);
    console.log('    Starts the development server.');
    console.log(`\n  ${chalk.cyan('npm run acul:dev')}`);
    console.log('    Starts the development server with mock Auth0 environment.');
    console.log(`\n  ${chalk.cyan('npm run build')}`);
    console.log('    Builds the app for production deployment.');
    console.log(`\nWe suggest that you begin by typing:\n`);
    console.log(`  ${chalk.cyan('cd')} ${projectName}`);
    console.log(`  ${chalk.cyan('npm install')}`);
    console.log(`  ${chalk.cyan('npm run acul:dev')}\n`);
    console.log(`Happy authenticating! 🔐\n`);
    
  } catch (error) {
    console.error(chalk.red('Error creating project:'), error);
  }
}

module.exports = initCommand;
