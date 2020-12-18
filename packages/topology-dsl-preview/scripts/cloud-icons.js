const sets = [
  {
    provider: 'Azure_Public_Service_Icons',
    prefix: 'az',
    path: 'assets/icons/Azure_Public_Service_Icons',
    pattern: '\\d+\\-icon\\-service\\-(.+)(ies|s)?\\.svg',
    resourceType: 'cloud',
    //excludes : ['/CXP','/Azure VMware Solution','/General']
  },
  {
    provider: 'GCP_Icons',
    prefix: 'gcp',
    path: 'assets/icons/GCP Icons/Products and services',
    pattern: '(.*).svg',
    resourceType: 'cloud'
  }
];

// Generate csv from iconSets
//provider, category, product, dsl, isDecorator, resourceType, tagName, subType, iconURL, typeURI, docURL
const fs = require('fs');
const mkdirp = require('mkdirp');
const chalk = require('chalk').default;
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
        let isDecorator = false;
        let resourceType = s.resourceType;
        let tagName = 'terminal';
        let subType = dsl;

        let iconURL = path.posix.join(s.path, category, fileStats.name);
        let typeURI = '';
        let docURL = '';

        console.log(category + ' => ' + iconURL + ' | ' + dsl);

        let resource = {
          provider,
          category,
          product,
          dsl,
          isDecorator,
          resourceType,
          tagName,
          subType,
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