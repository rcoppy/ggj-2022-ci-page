const { Octokit } = require("@octokit/core");
const fs = require("fs");

const main = async function() {
    const myArgs = process.argv.slice(2);
    console.log('myArgs: ', myArgs);

    // pass the API secret from runtime 
    const token = myArgs[0];
    const runId = parseInt(myArgs[1]); 

    // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
    const octokit = new Octokit({ auth: token });

    const response = await octokit.request('GET /repos/rcoppy/ggj-2022-game/actions/artifacts', {
        owner: 'rcoppy',
        repo: 'ggj-2022-game',
        run_id: runId
    }); 

    console.log(response);

    const windows = response.data
                            .artifacts
                            .find(artifact => artifact.name === 'build_StandaloneWindows64');
                           
    console.log(windows.archive_download_url);

    let windowsURL = null;

    if (windows) {
        windowsURL = windows.archive_download_url;
    }                         

    const macosx = response.data
                            .artifacts
                            .find(artifact => artifact.name === 'build_StandaloneOSX');
    
    let macosxURL = null;
    
    if (macosx) {
        macosxURL = macosx.archive_download_url; 
    }

    const base_path = './src/markdown/';

    if (windowsURL) {
        try {
            fs.rm(base_path + 'windows.md', function (err) {
                // if (err) throw err;
                // console.log('File is deleted successfully.');

                fs.writeFile(base_path + 'windows.md', windowsURL, function (err) {
                    if (err) throw err;
                    console.log('File is created successfully.');
                });
            });
        } catch {}
    }

    if (macosxURL) {
        try {
            fs.rm(base_path + 'macosx.md', function (err) {
                // if (err) throw err;
                // console.log('File is deleted successfully.');

                fs.writeFile(base_path + 'macosx.md', macosxURL, function (err) {
                    if (err) throw err;
                    console.log('File is created successfully.');
                });
            });
        } catch {}
    }
}

main();
