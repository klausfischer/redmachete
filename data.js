const fs = require('fs');
const path = require('path');
const glob = require('glob');
const set = require('lodash/set');

const data = (globPattern) => {
	return new Promise((resolve, reject) => {
		glob(globPattern, (err, files) => {
			if (err) {
				reject(err);
			}

			const mergedData = {};

			for (const file of files) {
				const filename = path.parse(file).name;
				const jsonPath = path.parse(file).dir.split('/').slice(1);
				let jsonKey = `${jsonPath.join('.')}.${filename}`;
				if (jsonPath.length === 0) {
					jsonKey = filename;
				}
				set(mergedData, jsonKey, JSON.parse(fs.readFileSync(file)));
			}

			resolve(mergedData);

		});
	});
};

module.exports = data;
