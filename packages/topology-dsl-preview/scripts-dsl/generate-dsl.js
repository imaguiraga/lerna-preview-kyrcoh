/* eslint-disable no-undef */
const fs = require('fs');
const { writeFileSync } = fs;
const { resolve, dirname, extname } = require('path');
const mkdirp = require('mkdirp');
const nunjucks = require('nunjucks');
const chalk = require('chalk');
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
  fs.readdir(templateDir, function (err, files) {
    console.log(files);

    for (const file of files) {
      // Render template
      const res = nunjucksEnv.render(file, context);
      // Create filename
      // Remove Template file extension
      let outputFile = file.substring(0, file.indexOf(extname(file)));
      outputFile = outputFile.replace('#',context.provider);
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
fs.readdir('scripts-dsl/yml', function (err, files) {
  files.forEach((f) => {
    try {
      console.log(f);
      yaml.loadAll(fs.readFileSync('scripts-dsl/yml/' + f, 'utf8'), function (doc) {
        // Remove duplicate items
        const dups = new Set();
        doc.items = doc.items.filter((i) => {
          if( !dups.has(i.dsl) ){
            dups.add(i.dsl);
            return true;
          } else {
            return false;
          }          
        });

        // Generate resources file
        render({ items: doc.items, ...doc.source, encodeURI, JSON }, 'scripts-dsl/templates', 'scripts-dsl/out/' + doc.source.provider);
      });
    } catch (e) {
      console.log(e);
    }
  });

});