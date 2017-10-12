# Relay WebApp [![Build Status](https://travis-ci.org/DopplerRelay/relay-webapp.svg?branch=develop)](https://travis-ci.org/DopplerRelay/relay-webapp) [![Sauce Test Status](https://saucelabs.com/buildstatus/dopplerrelay)](https://saucelabs.com/u/dopplerrelay)

## Setup

Before start you need to have installed:

* [Node.js](https://nodejs.org/download/)
* [NPM](https://www.npmjs.com/)
* [Bower](http://bower.io/) `npm install -g bower`
* [Gulp](http://gulpjs.com/) `npm install -g gulp`

One step install:

1. Run `npm install --no-optional` to download the project dependencies.

The flag `--no-optional` is being used due to an optional dependency called `gulp-gyp` between *Karma* dependencies. Using `gulp-gyp` involves to install Python 2.7 and a C++ compiler among other things, that is why is preferable to avoid if possible. Running an installation without optional dependencies reduces the installation requirements. With newer versions of *NPM*, installation without optional dependencies will be the default.

## Getting started

Run `node server` to start the Editor. For development is currently serving on port 3000: `localhost:3000`.

## Build

There is a Gulp task to achieve building. Run:

    set NODE_ENV=development
    gulp build
    gulp test -> Please remember to run this tests!!
After completion you could also test it if you run node like in a production environment:

    set NODE_ENV=development
    node server.js

## Development

Gulp default task is our best friend. To ensure a good development environment you only need a terminal or command prompt running the following task:

    gulp

That command will start a node server for development, watching for changes and validating every line of code you add/modify/remove.

##### Code validation

We are currently using a [linting tool](http://jshint.com/) and unit tests with [Jasmine framework](http://jasmine.github.io/) and [Karma runner](http://karma-runner.github.io/).

##### Livereload

Livereload is already configured but in order to use it you will need to install the [proper extension for your browser](http://livereload.com/extensions/).

- [Livereload for Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei).
- [Livereload for Firefox](http://download.livereload.com/2.1.0/LiveReload-2.1.0.xpi).

### Configurations per environment

We have available an `env.json` config file for use. Example of an environment change:

In Windows:

    set NODE_ENV=PROD

In Linux (or BASH):

    export NODE_ENV=PROD

`NODE_ENV` could be `PROD`, `QA`, `INT` or `development`.

*If you are trying to use `production` a **build is required** before run.*

### Modifying index.html

Each modification in the scripts/styles included at `index.html` leads to a proper update in `gulpfile.js`.

Lets suppose an scenario where a new lib is required. You need to add it at `index.html`. Build process will need it too.

### Testing

Tests runs by Karma and are written under Jasmine framework. And we can run them by the following task:

  gulp test

Each file placed inside `test` folder with a filename ending with `.spec.js` will be interpreted as a test file.

Since Protractor uses Selenium and Selenium is a Java application, [Java SDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) is required.

## Generate secure credentials for Travis + SauceLabs

The following steps are required to generate the SauceLabs secure credentials for Travis:

1- Make sure you have at least Ruby 1.9.3 (2.0.0 recommended) installed

2- You can check your Ruby version by running ruby -v

    $ ruby -v
    ruby 2.0.0p195 (2013-05-14 revision 40734) [x86_64-darwin12.3.0]

3- Then run:

    $ gem install travis -v 1.8.6 --no-rdoc --no-ri

4- Now make sure everything is working:

    $ travis version
    1.8.6

5- Open the git project folder on the command line and execute the following commands to get the secured credentials

5.1- Encrypt SauceLabs user using the following command:

    travis encrypt SAUCE_USERNAME="theusername"

5.2- Encrypt SauceLabs access key using the following command:

    travis encrypt SAUCE_ACCESS_KEY="theaccesskey"

References
* https://github.com/travis-ci/travis.rb#installation
* https://docs.travis-ci.com/user/encryption-keys/
* https://docs.travis-ci.com/user/sauce-connect/