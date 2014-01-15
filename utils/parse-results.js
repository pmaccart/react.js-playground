#!/usr/bin/env node

var program = require('commander'),
	fs = require('fs'),
	csv = require('csv');

function createFolders() {
	if (!fs.existsSync('results')) {
		fs.mkdirSync('results');
	}
	if (!fs.existsSync('results/event')) {
		fs.mkdirSync('results/event');
	}
	if (!fs.existsSync('results/event/52')) {
		fs.mkdirSync('results/event/52');
	}
	if (!fs.existsSync('results/event/52/type')) {
		fs.mkdirSync('results/event/52/type');
	}
	if (!fs.existsSync('results/event/52/type/individual')) {
		fs.mkdirSync('results/event/52/type/individual');
	}
	if (!fs.existsSync('results/event/52/type/team')) {
		fs.mkdirSync('results/event/52/type/team');
	}
	if (!fs.existsSync('results/event/94')) {
		fs.mkdirSync('results/event/94');
	}
	if (!fs.existsSync('results/event/94/type')) {
		fs.mkdirSync('results/event/94/type');
	}
	if (!fs.existsSync('results/event/94/type/individual')) {
		fs.mkdirSync('results/event/94/type/individual');
	}
	if (!fs.existsSync('results/event/94/type/team')) {
		fs.mkdirSync('results/event/94/type/team');
	}
}

function processIndividualResults(individualResults, callback) {

	createFolders();

	individualResults.forEach(function(result) {
		var dirName = 'results/event/' + result.event + '/type/individual';
		fs.writeFileSync(dirName + '/' + result.bib + '.json', JSON.stringify(result));
	});


	fs.writeFileSync('results/event/94/type/individual.json', JSON.stringify(individualResults));

	callback(null, null);
};

function processCsv(inFile, callback) {

	var individualResults = [];
	console.log('Processing CSV file at %s', inFile);

	csv()
	.from.path(inFile, { delimiter: ',', escape: '"', columns: true })
	.transform(function(result) {
		return {
			bib: result['NO.'],
			event: result['EVENT'],
			division: result['DIV'],
			firstName: result['FIRSTNAME'],
			lastName: result['LASTNAME'],
			rank: parseInt(result['OALLPLACE'], 10),
			time: result['TIME']
		};
	})
	.on('record', function(row, index){
		console.log('Processing row %d.', index, row)
	  individualResults.push(row);
	})
	.on('end', function(count){
		console.log('Read %d rows.', count);
		processIndividualResults(individualResults, callback);
	});

}	

var assertFileExists = function(infile) {
    return (infile && infile.toString());
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-i, --infile <csv_file>', 'Path to results CSV file to parse', clone(assertFileExists))
        .option('-d, --directory <directory>', 'Path to write results to')
        .parse(process.argv);

    if (program.infile) {
      var individualResults = processCsv(program.infile, function(err) {
      	console.log('Done');
      	process.exit(1);
      });
    }
    else {
      console.log('Must specify a results file');
    }
   
} else {
    exports.processCsv = processCsv;
}