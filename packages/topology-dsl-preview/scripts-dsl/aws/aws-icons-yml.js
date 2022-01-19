/* eslint-disable no-undef */
const sets = [
  {
    provider: 'AWS',
    prefix: 'aws',
    path: 'scripts-dsl/aws/AWS-Asset-Package/Asset-Package_09172021/Architecture-Service-Icons_09172021',
    pattern: 'Arch_(?<product>.*)_32.svg',
    kind: 'resource'
  }
];

// Generate csv from iconSets
//provider, category, product, dsl, isDecorator, kind, tagName, tagName, iconURL, typeURI, docURL
const fs = require('fs');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const yaml = require('js-yaml');

function cloudDsl(s) {
  'use strict';
  var walk = require('walk');
  var path = require('path');
  let resources = [];

  // Pattern
  let rex = new RegExp(s.pattern);
  let options = {
    filters: s.excludes
  };

  let promise = new Promise((resolutionFunc, rejectionFunc) => {
    try {
      if (!fs.existsSync(s.path)) {
        console.error(`Path not found ${s.path}`);
      }
    } catch(err) {
      console.error(err)
    }

    let walker = walk.walk(s.path, options);
    let dest = './public/assets/icons/AWS Icons';
    mkdirp.sync(dest);

    walker.on('file', function (root, fileStats, next) {
      let match = fileStats.name.match(rex);
      if (match != null) {

        let provider = s.provider;
        // Arch_(Alexa-For-Business)_32.svg
        let category = path.posix.basename(path.posix.dirname(root.replace(/\\/ig, '/')));
        // 'Alexa-For-Business' => 'Alexa For Business'
        let product = match.groups.product.replace(/-|_/ig, ' ');
        // 'Alexa For Business' => 'aws_Alexa For Business'
        let dsl = s.prefix + '_' + product.replace(/Arch/ig, '');
        // Replace special characters
        // 'asw_Alexa For Business' => 'aws_Alexa_For_Business'
        dsl = dsl.trim().replace(/(-|\s|\(|\)|\+|\\|&)+/g, '_').replace(/_+/g, '_');
        let kind = s.kind;
        let tagName = dsl;

        let iconURL = path.posix.join(root.replace(/\\/ig, '/'), fileStats.name);
        // Copy only required icons
        let tmp = path.posix.join(dest, fileStats.name);
        fs.copyFileSync(iconURL, tmp);
        iconURL = '/' + path.posix.relative('public/', tmp);
        let typeURI = '';
        let docURL = '';

        console.log(category + ' => ' + iconURL + ' | ' + dsl);

        let resource = {
          provider,
          category,
          product,
          dsl,
          kind,
          tagName,
          iconURL,
          typeURI,
          docURL
        };
        // Add resource
        resources.push(resource);
      }

      next();

    });

    walker.on('errors', function (root, nodeStatsArray, next) {
      next();
    });

    walker.on('end', function () {
      console.log('all done');
      // Generate resources file
      resolutionFunc(resources);
    });
  });

  return promise;
}

sets.forEach((s) => {
  cloudDsl(s).then((resources) => {
    // Generate resources file
    mkdirp.sync('./scripts-dsl/yml/');
    fs.writeFileSync('./scripts-dsl/yml/' + s.provider + '.yml', yaml.dump({ source: s, items: resources }));
  });
});

module.exports = {
  cloudDsl
};