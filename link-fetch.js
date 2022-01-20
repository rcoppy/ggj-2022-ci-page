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

    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/artifacts', {
        owner: 'octocat',
        repo: 'ggj-2022-game',
        run_id: runId
    }); 

    const windows = response.artifacts
                            .find(artifact => artifact.name === 'build_StandaloneWindows64');
                           
    let windowsURL = null;

    if (windows) {
        windowsURL = windows.archive_download_url;
    }                         

    const macosx = response.artifacts
                            .find(artifact => artifact.name === 'build_StandaloneOSX');
    
    let macosxURL = null;
    
    if (macosx) {
        macosxURL = macosx.archive_download_url; 
    }

    const base_path = './src/markdown';

    if (windowsURL) {
        fs.rm(base_path + 'windows.md');
        fs.writeFile(base_path + 'windows.md', windowsURL, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }

    if (macosxURL) {
        fs.rm(base_path + 'macosx.md');
        fs.writeFile(base_path + 'macosx.md', macosxURL, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }
}

main();
