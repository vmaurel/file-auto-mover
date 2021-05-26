const fs = require('fs');
var path = require("path");
var chokidar = require('chokidar');
const params = require('./params.json');



params.folders.forEach(folder => {

    var watcher = chokidar.watch(folder.source, { persistent: true });
    console.log(`Watching ${folder.source}`);

    const onFileAdded = oldPath => {
        setTimeout(() => {
            folder.extensions.forEach(ext => {
                if (oldPath.endsWith('.' + ext)) {
                    var file = path.basename(oldPath);
                    var newPath = `${folder.destination}\\${file}`
                    fs.rename(oldPath, newPath, function (err) {
                        if (err) throw err
                        console.log(`Moved file ${oldPath} to ${newPath}`);
                    })
                }
            })
        }, params.timeout);
    }

    watcher
        .on('add', onFileAdded)
        .on('change', onFileAdded)

});