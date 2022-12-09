const version = '1.0.0';
const creators = ['Sebastian Doe', 'Alex Walker'];

// --------------------------------------------------------- //

const process = require('process');
const os = require('os');
const fs = require('fs');
const hidefile = require('hidefile');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const sizeOf = require('image-size');
const chalk = require('chalk');


console.log(chalk.green(`SnipCatcher: v${version}`));
console.log(`Creators: ${creators.join(', ')}\n`);

const username = os.userInfo().username;
const staticDesktop = `C:\\Users\\${username}\\Documents\\`;
var desktopPath = `C:\\Users\\${username}\\Desktop\\`;
const usualDefaultLocation = `C:\\Users\\${username}\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\TempState\\ScreenClip\\`;
let isDefaultPath;

if (fs.existsSync(usualDefaultLocation)) {
	isDefaultPath = true;
} else {
	isDefaultPath = false;
}

if (fs.existsSync(staticDesktop + '.snipcatcher-redir.txt')) {
	console.log(`Redirect file detected in ${chalk.green('Documents')}\n`);
	desktopPath = fs.readFileSync(staticDesktop + '.snipcatcher-redir.txt');
}

console.log(`Using SnipCatcher as`, chalk.green(`${username}\n`));

console.log('View dependencies at https://raw.githubusercontent.com/sd0e/snipcatcher/main/README.md\n');

console.log(`Your screenshots will be saved to ${chalk.green(desktopPath)}\n`);

process.chdir(`C:/Users/${username}/AppData/Local`);

var twirlTimer = (function() {
	var P = ["\\", "|", "/", "-"];
	var x = 0;
	var times = 0;
	var s = 0;
	return setInterval(function() {
		process.stdout.write(chalk.yellow(`\r${P[x++]} Loading Directory (${s}s)`));
		x &= 3;
		times++;
		if (times % 4 === 0) {
			s++;
		};
	}, 250);
})();

twirlTimer;

const createJSONIfNotExist = () => {
	const pathToJSON = desktopPath + 'snipcatcher.txt';
	if (!fs.existsSync(pathToJSON)) {
		fs.writeFileSync(pathToJSON, '');
	}
}

createJSONIfNotExist();

const getListOfFiles = () => {
	return fs.readFileSync(desktopPath + 'snipcatcher.txt').toString();
}

const hasImageBeenDealtWith = file => {
	const listOfFiles = getListOfFiles().split('\n');
	for (let i = 0; i < listOfFiles.length; i++) {
		const fileInList = listOfFiles[i];
		if (fileInList.trim() === file.trim()) {
			return true;
		}
	}
	return false;
}

const addImageToJSON = file => {
	const pathToJSON = desktopPath + 'snipcatcher.txt';
	fs.appendFileSync(pathToJSON, file + '\n');
}

global.allRes = {};

const dealWithImage = file => {
	return new Promise(resolve => {
		if (!hasImageBeenDealtWith(file)) {
			fs.stat(file, (err, stats) => {
				const creationTime = stats.birthtimeMs;
				foundRelated = false;
				sizeOf(file, (err, res) => {
					global.allRes[creationTime.toString()] = [file, res.width * res.height];
					resolve();
				});
			});
			addImageToJSON(file);
		} else {
			resolve();
		}
	});
}

const copyFile = src => {
	return new Promise(resolve => {
		const desktopFolderPath = desktopPath + 'SnipCatcher\\';
		const toCopyPath = desktopFolderPath + path.basename(src);
		if (!fs.existsSync(desktopFolderPath)) {
			fs.mkdirSync(desktopFolderPath);
		}
		if (!fs.existsSync(toCopyPath)) {
			fs.copyFile(src, toCopyPath, err => {
				if (err) throw err;
				resolve();
			});
		} else {
			resolve();
		}
	});
}

const checkAllFinished = () => {
	for (i = 0; i < global.allArray.length; i++) {
		if (global.allArray[i] !== true) return;
	}

	// All files have now been added to array

	// Sort keys by increasing numerical value
	let keys = Object.keys(global.allRes);
	for (i = 0; i < keys.length; i++) {
		keys[i] = Number(keys[i]);
	}
	keys.sort((a, b) => a - b);

	// Ensure that images are all pairs
	for (i = 0; i < keys.length; i += 2) {
		const thisKey = keys[i];
		const nextKey = keys[i + 1];
		if (nextKey - thisKey === NaN) {
			allRes[Number(thisKey) + 0.1] = [false, 65520];
			checkAllFinished();
			return;
		} else if (nextKey - thisKey > 1000) {
			allRes[Number(thisKey) + 0.1] = [false, 65520];
			checkAllFinished();
			return;
		}
	}

	// Loop through every pair of images
	for (i = 0; i < keys.length; i += 2) {
		const thisKey = keys[i];
		const nextKey = keys[i + 1] === undefined ? keys[i] : keys[i + 1];
		if (nextKey - thisKey <= 1000) {
			let keyToCopy;
			if (global.allRes[thisKey][1] == 65520 && global.allRes[nextKey][1] == 65520) {
				keyToCopy = thisKey;
			} else if (global.allRes[thisKey][1] == 65520) {
				keyToCopy = nextKey;
			} else if (global.allRes[nextKey][1] == 65520) {
				keyToCopy = thisKey;
			} else {
				keyToCopy = global.allRes[thisKey][1] >= global.allRes[nextKey][1] ? thisKey : nextKey;
			}
			copyFile(global.allRes[keyToCopy][0]).then(() => {
				console.log(chalk.green(path.basename(global.allRes[keyToCopy][0])), 'copied to the', chalk.green('SnipCatcher'), 'folder at', `${chalk.green(desktopPath)}\n`);
				setTimeout(alertWatching, 500);
			});
		}
	}
}

const alertWatching = () => {
	// Prevent alert spamming by limiting rate
	if (new Date().getTime() - global.timeSinceLastAlert < 500) return;

	console.log(chalk.green('\nWatching for new files...'));
	console.log('Press', chalk.green('Ctrl + X'), 'at any time to change the save directory\n\n');

	global.timeSinceLastAlert = new Date().getTime();
}

const directoryFound = directory => {
	const filesInDirectory = fs.readdirSync(directory);

	let numberOfImages = 0;

	for (let i = 0; i < filesInDirectory.length; i++) {
		const file = filesInDirectory[i];
		const ext = path.extname(file);
		if (ext === '.png' || ext === '.jpg') {
			numberOfImages++;
		}
	}

	global.allArray = new Array(numberOfImages);

	let currentNumOfImage = 0;

	for (let i = 0; i < filesInDirectory.length; ++i) {
		const file = filesInDirectory[i];
		const ext = path.extname(file);
		if (ext === '.png' || ext === '.jpg') {
			const thisImageNumber = currentNumOfImage;
			if (!global.inProgress) {
				dealWithImage(directory + file).then(() => {
					global.allArray[thisImageNumber] = true;
					checkAllFinished();
				});
			}
			currentNumOfImage++;
		}
	}

	// Watch for new files

	global.numOfNewFiles = 0;

	fs.watch(directory, (eventType, fileName) => {
		const ext = path.extname(fileName);
		if (eventType === 'change') {
			if (ext === '.png' || ext === '.jpg') {
				global.numOfNewFiles++;
				if (global.numOfNewFiles % 2 === 0) {
					global.newEventSince = true;
					console.log(chalk.yellow('New screenshot detected\n'));
					dealWithImage(directory + fileName).then(() => {
						global.allArray[1] = true;
						checkAllFinished();
					});
				} else {
					global.allRes = {};
					global.allArray = new Array(2);
					global.newEventSince = false;
					dealWithImage(directory + fileName).then(() => {
						global.allArray[0] = true;
						checkAllFinished();
					});
					setTimeout(() => {
						if (global.newEventSince === false) {
							global.numOfNewFiles = 0;
							global.allArray = global.allArray[0] === true ? [true] : [false];
							checkAllFinished();
						}
					}, 1500);
				}
			}
		}
	});
}

if (isDefaultPath) {
	clearInterval(twirlTimer);

	setTimeout(alertWatching, 500);

	console.log(chalk.green('\n\nDirectory found\n'));

	directoryFound(usualDefaultLocation);
} else {
	exec('dir ScreenClip /s', { cwd: `C:/Users/${username}/AppData/Local` }).then(res => {
		clearInterval(twirlTimer);

		setTimeout(alertWatching, 500);

		console.log(chalk.green('\n\nDirectory found\n'));
		const directory = res.stdout.split('Directory of ')[1].split('\\TempState')[0] + '\\TempState\\ScreenClip\\';

		directoryFound(directory);
	}).catch(err => {
		// If folder doesn't exist

		clearInterval(twirlTimer);
		
		if (err.stderr.includes('File Not Found')) {
			console.log(chalk.red('\n\nNo screenshots exist in the directory. Take a screenshot and run the program again.'));
			console.log('Press Ctrl+C to exit.');
			process.stdin.resume();
		}
	});
}

process.on('SIGINT', () => process.exit());

const readline = require('readline');

const setNewLocation = () => {
	console.log('By continuing, you allow a new hidden file to be generated in your', chalk.green('Documents'), 'folder\n');

	const prompt = require('prompt');

	prompt.start();

	prompt.get(['New Path', 'Would you like to move your SnipCatcher folder (y/n)'], (err, res) => {
		if (err) throw err;
		let newPath = res['New Path'];
		if (newPath.toLowerCase() === 'desktop') {
			newPath = `C:\\Users\\${username}\\Desktop\\`;
		} else if (newPath.toLowerCase() === 'documents') {
			newPath = `C:\\Users\\${username}\\Documents\\`;
		} else if (newPath.toLowerCase() === 'downloads') {
			newPath = `C:\\Users\\${username}\\Downloads\\`;
		} else if (newPath.toLowerCase() === 'music') {
			newPath = `C:\\Users\\${username}\\Music\\`;
		} else if (newPath.toLowerCase() === 'pictures') {
			newPath = `C:\\Users\\${username}\\Pictures\\`;
		} else if (newPath === '') {
			console.log(chalk.red('A path must be entered.\n'));
			return;
		}
		newPath = newPath.slice(newPath.length - 1) === '\\' ? newPath : newPath + '\\';
		newPath = newPath.replace(/\//g, '\\');

		if (!fs.existsSync(newPath)) {
			fs.mkdirSync(newPath, { recursive: true });
		}
		
		// Move snipcatcher.txt to new directory
		fs.renameSync(desktopPath + 'snipcatcher.txt', newPath + 'snipcatcher.txt');

		const moveFolderChoice = res['Would you like to move your SnipCatcher folder (y/n)'].toLowerCase();
		if (moveFolderChoice === 'y' || moveFolderChoice === 'yes') {
			if (fs.existsSync(desktopPath + 'SnipCatcher')) {
				fs.renameSync(desktopPath + 'SnipCatcher', newPath + 'SnipCatcher');
			}
		}

		fs.writeFileSync(staticDesktop + 'snipcatcher-redir.txt', newPath);
		hidefile.hideSync(staticDesktop + 'snipcatcher-redir.txt');

		desktopPath = newPath;

		console.log('\nDirectory successfully changed to', chalk.green(desktopPath) + '\n');
	});
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
	if (key.name === 'x' && key.ctrl) {
		setNewLocation();
	}
});
