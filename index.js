#!/usr/bin/env node

// a script to help generate feature component boilerplate

var path = require('path');
var fs = require('fs-extra');

var componentName;

var program = require('commander')
  .version(require('./package.json').version)
  .arguments('<component-directory>')
  .action(function (name) {
    componentName = name;
  })
  .option('-p, --pure', 'Create Pure Function Component')
  .parse(process.argv);

createComponent(componentName);

function createComponent(name) {
  // trigger directory
  if (!name) {
    console.log('missing name');
    throw new Error('Missing name.');
  }
  var root = path.resolve(name);

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  if (program.pure) {
    fs.writeFileSync(
      path.join(root, `${name}.js`),
      `/*\n<Project Name> Component\n${name}\n*/\n` +
      'import React from \'react\';\n' +
        `const ${name} = (props) => {\n` +
        '\treturn (\n' +
          '\t\t<div>\n\t\t</div>\n' +
        '\t)\n' +
      '}\n\n'
    );
  }
  else {
    // write index file
    fs.writeFileSync(
      path.join(root, 'index.js'),
      `export {default} from './${name}';`
    );

    // write style file
    fs.writeFileSync(
      path.join(root, `${name}.style.js`),
      'import styled from \'styled-components\';\n' +
      'const Component = styled.div`\n' +
      '`;\n' +
      'export default Component;'
    );

    // write main file
    fs.writeFileSync(
      path.join(root, `${name}.js`),
      'import React, { Component } from \'react\'\n' +
      'import {connect} from \'react-redux\';\n' +
        `import ${name}Style from './${name}.style'\n` +
      `class ${name} extends Component {\n\n` +
        '\tcomponentDidMount() {\n' +
        '\t}\n\n' +
        '\trender() {\n' +
          '\t\treturn (\n' +
          `\t\t\t<${name}Style>\n` +
          `\t\t\t</${name}Style>\n` +
          '\t\t)\n\n' +
        '\t}\n\n' +
      '}\n' +
    'const mapStateToProps = (state) => ({\n' +
    '});\n\n' +
    'const mapDispatchToProps = (dispatch, ownProps) => ({\n' +
    '});\n' +
    `export default connect(mapStateToProps, mapDispatchToProps)(${name});`
    );
  }

  console.log(`Component ${name} created`);
}

