const sets = [
  /*
  {
    provider: 'AZURE',
    prefix: 'az',
    path: 'assets/icons/Azure_Public_Service_Icons',
    pattern: '\\d+\\-icon\\-service\\-(.+)(ies|s)?\\.svg',
    kind: 'resource',
    //excludes : ['/CXP','/Azure VMware Solution','/General']
  },//*/
  {
    provider: 'GCP',
    prefix: 'gcp',
    path: 'assets/icons/GCP Icons/Products and services',
    pattern: '(.*).svg',
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
    let walker = walk.walk('public/' + s.path, options);

    walker.on('file', function (root, fileStats, next) {
      let found = fileStats.name.match(rex);
      if (found != null) {

        let provider = s.provider;

        let category = path.basename(root);
        let product = found[1];
        let dsl = s.prefix + '_' + found[1];
        // Replace special characters
        dsl = dsl.replace(/\-|\s+|\(|\)|\+/g, '_');
        let kind = s.kind;
        let tagName = dsl;
        let iconURL = path.posix.join(s.path, category, fileStats.name);
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
    mkdirp.sync('./scripts/yml/');
    fs.writeFileSync('./scripts/yml/' + s.provider + '.yml', yaml.safeDump({ source: s, items: resources }));
  });
});

module.exports = {
  cloudDsl
};