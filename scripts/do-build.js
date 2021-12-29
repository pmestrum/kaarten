var fs = require('fs');
const fsPromises = require('fs').promises;
var { exec, execSync } = require('child_process');
const process = require('process');

const startingDirectory = process.cwd();
let currentDirectory = process.cwd();
while (currentDirectory.endsWith('dist') || currentDirectory.endsWith('ang-kaarten') || currentDirectory.endsWith('scripts')) {
    process.chdir('..');
    currentDirectory = process.cwd();
}

const logTitle = title => {
    console.log('*****************************************************************************'.substring(0, title.length + 4));
    console.log(`* ${title} *`)
    console.log('*****************************************************************************'.substring(0, title.length + 4));
}

const doBuild = () => {
    logTitle('Start npm run build')
    process.chdir('ang-kaarten');
    console.log(execSync('npm run build'));
    process.chdir('..');
    console.log('Done');
}

const doCopy = async () => {
    logTitle('Copy files')
    const copyFile = async (filename) => {
        return new Promise((resolve, reject) => {
            const src = `${currentDirectory}/ang-kaarten/dist/ang-kaarten/${filename}`;
            const dest = `${currentDirectory}/${filename}`;

            const content = fs.readFileSync(src, 'utf8');
            fs.writeFileSync(dest, content, 'utf8');
            console.log(`${filename} copied`);
            resolve();
        })
    }

    await copyFile('main.js');
    await copyFile('polyfills.js');
    await copyFile('runtime.js');
    await copyFile('index.html');
    await copyFile('styles.css');
    await copyFile('favicon.ico');
    console.log('Done');
}

const doAddTimestampInIndexHtml = async () => {
    logTitle('Add timestamp to index.html')
    return new Promise((resolve, reject) => {
        fs.readFile('index.html', 'utf8', (error, data) => {
            if (error) {
                console.error(`Can't read index.html`);
                console.error(err);
                process.exit(1);
            }
            const timestamp = new Date().getTime();
            const variableFactor = `?timestamp=${timestamp}`;
            data = data.replace(new RegExp(`href="styles.css(/?[^"]+)?"`), `href="styles.css${variableFactor}"`);
            // <script src="runtime.js" type="module"></script><script src="polyfills.js" type="module"></script><script src="main.js" type="module"></script>
            ['runtime', 'polyfills', 'main'].forEach(script => {
                data = data.replace(new RegExp(`src="${script}.js(/?[^"]+)?"`), `src="${script}.js${variableFactor}"`);
            })
            fs.writeFile('index.html', data, 'utf8', error => {
                if (error) {
                    console.error(`Can't read index.html`);
                    console.error(err);
                    process.exit(1);
                }
                console.log('Done');
                resolve();
            });
        });
    });
}

const doProcess = async () => {
// do build
    doBuild();

// copy files from dist to root
    await doCopy();

// add timestamps to urls
    await doAddTimestampInIndexHtml();
    process.chdir(startingDirectory);
}

doProcess();
