const path = require('path');
const copydir = require('copy-dir');
const jsonfile = require('jsonfile');
const fs = require('fs');
const writeFile = require('write-file');
const packagejson = require('../package.json');

copydir.sync(path.resolve(__dirname, '../build/static/'), path.resolve(__dirname, '../../../public/static/'));

const mixContent = fs.readFileSync(path.resolve(__dirname, '../build/mix.html'));

writeFile(path.resolve(__dirname, '../../../resources/views/mix.blade.php'), mixContent, function (err) {
    if (err) return console.log(err);
    console.log('mix.blade.php updated.');
});

jsonfile.readFile(path.resolve(__dirname, '../build/asset-manifest.json'))
    .then(obj => {
        const manifest = Object.assign(...Object.entries(obj).map(([k, v]) => ({[v]: v.replace(packagejson.homepage, '/')})));
        return writeJson(manifest);
    })
    .catch(error => console.error(error))


const writeJson = (manifest) => {
    return jsonfile.writeFile(path.resolve(__dirname, '../../../public/mix-manifest.json'), manifest, { spaces: 2, EOL: '\r\n' })
    .then(res => {
      console.log('Mix Manifest created')
    })
};