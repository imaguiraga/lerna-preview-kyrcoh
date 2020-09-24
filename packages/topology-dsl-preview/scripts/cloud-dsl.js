const sets = [
  {
    provider: "Azure",
    prefix: "az",
    path: "assets/icons/Azure_Public_Service_Icons",  
    pattern : "\\d+\\-icon\\-service\\-(.+)(ies|s)?\\.svg",
    resourceType : "cloud",
    //excludes : ["/CXP","/Azure VMware Solution","/General"]
  },
  {
    provider: "Google Cloud Platform",
    prefix: "gcp",
    path: "assets/icons/GCP Icons/Products and services",
    pattern: "(.*).svg",
    resourceType : "cloud"
  }
];

// Generate csv from iconSets
//provider, category, product, dsl, isDecorator, resourceType, tagName, subType, iconPath, typeURI, docURI
const fs = require('fs');
const { writeFileSync } = fs;
const { resolve, dirname, extname } = require('path');
const nunjucks = require('nunjucks');
const mkdirp = require('mkdirp');
const chalk = require('chalk').default;

function cloudDsl(s) {
  "use strict";
  var walk = require('walk');
  var path = require('path');
  let resources = [];

  // Pattern
  let rex = new RegExp(s.pattern);
  let options = {
    filters: s.excludes
  };

  let promise = new Promise((resolutionFunc,rejectionFunc) => {
    let walker = walk.walk("public/"+s.path, options);

    walker.on("file", function (root, fileStats, next) {
      let found = fileStats.name.match(rex);
      if(found != null ){
        
        let provider = s.provider;
        
        let category = path.basename(root);
        let product = found[1];
        let dsl = s.prefix+"_"+found[1];
        // Replace special characters
        dsl = dsl.replace(/\-|\s+|\(|\)|\+/g,'_');
        let isDecorator = false;
        let resourceType = s.resourceType;
        let tagName = "terminal";
        let subType = dsl;

        let iconPath = path.posix.join(s.path,category,fileStats.name);
        let typeURI = ""; 
        let docURI = "";

        console.log(category+ " => " + iconPath + " | "+dsl);

        let resource = {
          provider, 
          category, 
          product,
          dsl, 
          isDecorator, 
          resourceType, 
          tagName, 
          subType, 
          iconPath, 
          typeURI, 
          docURI
        };
        // Add resource
        resources.push(resource);
      }

      next();

    });
    
    walker.on("errors", function (root, nodeStatsArray, next) {
      next();
    });
    
    walker.on("end", function () {
      console.log("all done");
      // Generate resources file
      resolutionFunc(resources);
    });
  });

  return promise;
}

const render = (
	/** @type {Object} */ context, 
	/** @type {string} */ templateDir, 
  /** @type {string} */ outputDir
 ) => {

	/** @type {nunjucks.ConfigureOptions} */
	const nunjucksOptions = { 
		trimBlocks: true, 
		lstripBlocks: true, 
		noCache: true, 
		autoescape: false 
	};

	/** @type {nunjucks.Environment} */
  const nunjucksEnv = nunjucks.configure(templateDir, nunjucksOptions);
  // Process all input
  // Process all templates
  fs.readdir(templateDir, function(err, files) {
    console.log(files);

    for (const file of files) {
      const res = nunjucksEnv.render(file, context);
      // Remove Template file extension
      let outputFile = context.prefix + "-" + file.substring(0,file.indexOf(extname(file)));

      if (outputDir) {
        outputFile = resolve(outputDir, outputFile);
        mkdirp.sync(dirname(outputFile));
      }

      console.log(chalk.green('Rendering: ' + file));
      writeFileSync(outputFile, res);
    }
  });
};

sets.forEach((s) => {
  cloudDsl(s).then((resources) => {
    // Generate resources file
    render({ items: resources , ...s, encodeURI },"scripts/templates","scripts/out/"+s.prefix);
  });
});

module.exports = {
  cloudDsl, 
  render
};