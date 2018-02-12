# Gulp Materialize Boilerplate

Boiler plate for those who want things like materializecss, babel, eslint, sass, pug templating, but would perfer to use gulp

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Project Structure
### Summary

This is my take on a JAMstack project. We use gulp to handle all task running. Precompilation of SASS, transpilation of (es6 => es2015) JS, image minification, and pug template compilation is all handled in the default Gulp task `yarn gulp`. This allows for responsive changes without losing the benefits of newer technologies. 

`yarn gulp` will compile the `app/src` folder into `app/build`. `app/build` is then served via [BrowserSync](https://www.npmjs.com/package/browser-sync). Several watch scripts will refresh the browser when necessary.

### File Structure Diagram
```
Project/
├── app/
│   ├── build/
│   │   ├── css
│   │   │   └── <compiled-styles>.css 
│   │   ├── img
│   │   │   └── <minified-images>.<ext>
│   │   ├── js
│   │   │   ├── vendor.js
│   │   │   └── main.js (babelified)
│   │   └── index.html
│   └── src/
│       ├── fonts
│       │   └── <fonts>.<ext>
│       ├── img
│       │   └── <raw-images>.<ext>
│       ├── js
│       │   ├── vendor/
│       │   └── main.js (es6)
│       ├── scss
│       │   ├── components/
│       │   │   └── <vendor components>
│       │   ├── _variables.scss
│       │   ├── materialize.scss
│       │   └── styles.scss
│       └── views 
│           ├── components/
│           │   └── component.pug
│           ├── includes/ 
│           │   ├── footer.pug
│           │   ├── head.pug
│           │   └── nav.pug
│           └── index.pug
├── dist/
│   ├── css
│   │   └── <compiled-styles>.css 
│   ├── fonts
│   │   └── <fonts>.<ext>
│   ├── img
│   │   └── <minified-images>.<ext>
│   ├── js
│   │   ├── main.min.js
│   │   └── main.min.js.map
│   └── index.html
├── .eslintrc
├── .gitignore
├── gulpfile.js
├── package.json
├── README.md
└── yarn.lock
```

### Prerequisites

Node, NPM, Yarn

Everything should be a dev-dependency and can be accessed via scripts in package.json

```
//package.json
{
  ...,
  "scripts": {
    ...
    "gulp": "gulp",
    ...
  }
  {...},
  "author": "tabucker",
  "license": "MIT",
  "devDependencies": {
    ...
    "gulp": "^3.9.0",
    ...
  }
}
```
In this case, gulp can be accessed via:
```
yarn gulp <gulp task>
```

### Installing

Assuming you have the pre-reqs:

Install

```
yarn install
```

## Running the tests

Currently only a JS linter is in place, courtesy of ESLint:
```
yarn gulp lint
```

*Note* This is also run as a pre-commit script using [husky](https://www.npmjs.com/package/husky). Think git-hooks without an install-githooks.sh This can be removed.


### Coding Style Test

JS style enforced via ESLint and the AirBnB model.

```
//.eslintrc
{
  "env": {
    ...
  },
  "extends": "airbnb-base",
  "parser": "babel-eslint",
  "parserOptions": {
    ...
  }
}
```

## Deployment

Integrate however you would like. yarn gulp build:prod will provide you your dist files.

```
yarn gulp build
```

## Contributing

Submit a PR.

## Authors

* **Taylor Buckner** - *Initial work* - [tabuckner](https://github.com/tabuckner)

## License

This project is licensed under the MIT License
