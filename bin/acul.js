#!/usr/bin/env node

const { program } = require('commander');
const initCommand = require('../lib/commands/init');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .description('Auth0 ACUL CLI - Create and manage ACUL projects with ease');

program
  .command('init <projectName>')
  .description('Initialize a new ACUL project')
  .action((projectName) => {
    initCommand(projectName);
  });

program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
