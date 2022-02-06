/* eslint-disable no-undef */
const fs = require('fs');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const yaml = require('js-yaml');

const readline = require('readline');

const SET = {
  provider: 'CNCF',
  prefix: 'cncf',
  path: 'scripts-dsl/cncf/interactive_landscape.csv',
  pattern: '^(?<name>.+),(?<organization>.+),(?<homepage>.+),(?<logo>.+)(,.*)*',
  kind: 'resource'
};

// Creating a readable stream from file
// readline module reads line by line 
// but from a readable stream only.
const file = readline.createInterface({
  input: fs.createReadStream(SET.path, {encoding: 'utf-8'}),
  output: process.stdout,
  terminal: false
});

// Printing the content of file line by
//  line to console by listening on the
// line event which will triggered
// whenever a new line is read from
// the stream
let resources = [];
const REGEX = new RegExp(SET.pattern,'u');
let first = true;
file.on('line', (line) => {
  //console.log(line);
  // Skip header
  if (first) {
    first = false;
    return;
  }
  const match = line.replaceAll(/"/g, '').split(',');
  //const match = line.match(REGEX);
  //let tmp = line.replaceAll(/","/g, ',');
   // Regex not working because of special characters in the file
  //const match = tmp.match(REGEX);
  //const match = REGEX.exec(tmp);
  //const match = line.match(REGEX);
 
  if (match !== null) {
    let category = match[1];//.groups.Organization;
    let product = match[0];//.groups.Name
    let dsl = SET.prefix + '_' + product.trim().replace(/(-|\s|\(|\)|\+|\\|&)+/g, '_').replace(/_+/g, '_');
    let resource = {
      provider: SET.provider,
      category: category,
      product: product,
      dsl: dsl,
      kind: SET.kind,
      tagName: dsl,
      iconURL: match[3],//.groups.Logo,
      typeURI: null,
      docURL: match[2]//.groups.Homepage
    };
    console.log(resource);
    resources.push(resource);
  }
});

file.on('close', () => {
  //mkdirp.sync('./scripts-dsl/yml/');
  //fs.writeFileSync('./scripts-dsl/yml/' + SET.provider + '.yml', yaml.dump({ source: SET, items: resources }));
});