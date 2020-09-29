const fs = require('fs');
const { writeFileSync } = fs;
const { resolve, dirname, extname } = require('path');
const mkdirp = require('mkdirp');
const nunjucks = require('nunjucks');
const chalk = require('chalk').default;
const yaml = require('js-yaml');

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
  fs.readdir(templateDir, function(err, files) {
    console.log(files);

    for (const file of files) {
      // Render template
      const res = nunjucksEnv.render(file, context);
      // Create filename
      // Remove Template file extension
      let outputFile = context.provider + "-" + file.substring(0,file.indexOf(extname(file)));

      if (outputDir) {
        outputFile = resolve(outputDir, outputFile);
        mkdirp.sync(dirname(outputFile));
      }

      console.log(chalk.green('Rendering: ' + file));
      writeFileSync(outputFile, res);
    }
  });
};


// Process all yaml files
fs.readdir("scripts/yml", function(err, files) {
  files.forEach((f) => {
    try {
      yaml.safeLoadAll(fs.readFileSync("scripts/yml/"+f, 'utf8'), function (doc) {
        // Generate resources file
        render({ items: doc.items , ...doc.source, encodeURI },"scripts/templates","scripts/out/"+doc.source.provider);
      });
    } catch (e) {
        console.log(e);
    }
  });

});