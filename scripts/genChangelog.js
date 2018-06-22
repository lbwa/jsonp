// a package for generating a child process in node
const execa = require('execa')

// API from github repo conventional-changelog-core
const cc = require('conventional-changelog')

const gen = module.exports = version => {
  const fileStream = require('fs').createWriteStream(`CHANGELOG.md`)

  cc({
    preset: 'angular',
    // how many releases of changelog you want to generate from the upcoming.
    // set to 0 to regenerate all
    releaseCount: 0,
    // the location of your 'package.json'
    pkg: {
      // a function that takes `package.json` data as the arguments
      // more detail: conventional-changelog-core
      transform (pkg) {
        pkg.version = `v${version}`
        return pkg
      }
    }
  }).pipe(fileStream).on('close', async () => {
    // delete process.env.PREFIX
    await execa('git', ['add', '-A'], { stdio: 'inherit' })
    await execa('git', ['commit', '-m', `chore: ${version} changelog [ci skip]`], { stdio: 'inherit' })
  })
}

// activated by `node scripts/genChangelog.js run`
if (process.argv[2] === 'run') {
  const version = require('../package.json').version
  gen(version)
}

// reference: https://github.com/vuejs/vue-cli/blob/dev/scripts/genChangelog.js
