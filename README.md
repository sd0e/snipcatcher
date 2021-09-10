# SnipCatcher
SnipCatcher is a program which enables the autosaving of images in Windows Snip and Sketch. It is made in Node.js and has been compiled into a standalone executable file using [nexe](https://github.com/nexe/nexe).

## Installation and Use
### Installation
SnipCatcher can be installed by downloading the executable file from [the latest release](https://github.com/sebastiandoe5/snipcatcher/releases).

Alternatively, you can use the Node.js version with the latest version of [Node.js](https://nodejs.org/en/) installed by cloning this repository and running `npm install` then `node snipcatcher` in the directory of the clone.

### Use
Upon running the program, it will show information about the location of the program, and then it will locate the cache folder of Snip and Sketch. Once the directory is located, the highest resolution version of each screenshot is copied to a folder on the desktop.

The program then places a watch on the temporary folder; as soon as a new screenshot is detected, it copies it to the folder on the desktop.

This means that in order for the program to copy files, the program must be running.

#### Changing the save location

To change the save location, press `Ctrl + X` after the cache folder has been located. This will prompt you for a new directory, and whether the folder on the desktop containing screenshots should be moved.

If you are changing the save location to a folder like `Documents` or `Pictures`, you may simply put either `Documents` or `Pictures` as the new location.

Note that changing the save location to anywhere will create a hidden file in the Documents folder.

## Uninstalling

As this program is standalone, it does not install any programs on your system. To remove all of this program's files from your system, delete the following:
* snipcatcher.exe (from where the program is run)
* .snipcatcher-redir.txt from the Documents folder (if the save location has been changed)
* SnipCatcher folder (from the save location, Desktop if default)
* snipcatcher.txt (from the save location, Desktop if default)

## Dependencies
This program uses the following dependencies:
* [chalk](https://github.com/chalk/chalk) - [MIT License](https://raw.githubusercontent.com/chalk/chalk/main/license)
* [hidefile](https://github.com/stevenvachon/hidefile) - [MIT License](https://raw.githubusercontent.com/stevenvachon/hidefile/master/license)
* [image-size](https://github.com/image-size/image-size) - [MIT License](https://raw.githubusercontent.com/image-size/image-size/main/LICENSE)
* [prompt](https://github.com/flatiron/prompt) - [MIT License](https://raw.githubusercontent.com/flatiron/prompt/master/LICENSE)
