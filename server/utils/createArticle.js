const fs = require('fs');
const exec = require('await-exec');
const { assert } = require('console');

function writeArticleFile(inputString, folderNumber) {
    fs.writeFile(process.env.BLOG_HOME + 'articles/' + folderNumber + '/article.md', inputString, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("article.md saved!");
    }); 
}

function writeMetaJSON(metaObj, folderNumber) {
    fs.writeFile(process.env.BLOG_HOME + 'articles/' + folderNumber + '/meta.json', JSON.stringify(metaObj, null, "  "), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("meta.json saved!");
    }); 
}


async function addSingleArticle(folderNumber) {
    try {
        const path = process.env.BLOG_HOME + 'articles/' + folderNumber;
        let {stdout, stderr} = await exec("ipfs add -r " + path);
        if (stderr) console.log(`STDERR: \n ${stderr}`);
        let folderCID = extractLastCID(stdout);
        console.log("fold: ",  folderCID)        
        updateDBfile(folderCID);
        console.log("The article was added to IPFS");
        return 0;
    } catch (error) {
        console.error("Error while adding single article: ", error);
        return error;
    }
}



async function publishArticles() {
    try {
        const path = process.env.BLOG_HOME + 'articles/';
        let ipfsAddReturnObj = await exec("ipfs add -r " + path);
        let articlesCID = extractLastCID(ipfsAddReturnObj.stdout);
        console.log("articles: ",  articlesCID);
        let publishReturnObj = await exec(`ipfs name publish --key=${process.env.ARTICLES_KEY_NAME} /ipfs/${articlesCID}`);
        assert(publishReturnObj.stderr.length === 0, "stderr.length is not null. Probably there was an error while publishing the new CID.")
        console.log("STDOUT: \n", publishReturnObj.stdout);
    } catch (error) {
        console.error("Error while publishing articles: ", error);
    }
}

async function publishDatabase() {
    try {
        const path = process.env.BLOG_HOME + 'database.json';
        let ipfsAddReturnObj = await exec("ipfs add " + path);
        let dbCID = extractLastCID(ipfsAddReturnObj.stdout);
        console.log("db: ",  dbCID);
        let publishReturnObj = await exec(`ipfs name publish --key=${process.env.DB_KEY_NAME} /ipfs/${dbCID}`);
        assert(publishReturnObj.stderr.length === 0, "stderr.length is not null. Probably there was an error while publishing the new CID.")
        console.log("STDOUT: \n", publishReturnObj.stdout);
    } catch (error) {
        console.error("Error while publishing database: ", error);
    }
}


function extractLastCID(text) {
    try {
        const lines = text.split('\n');
        const folderLine = lines[lines.length-2];
        const cidRegEx = /[a-zA-Z0-9]{32,}/g;
        console.log('lines: ', lines);
        assert(folderLine.includes('add'), "The selected line does not contain the keyword 'add', most likely this is the wrong line.");
        const lastCID = folderLine.match(cidRegEx)[0];
        assert(lastCID.length > 32, "folderCID length is too short. Most likely the CID extraction was not successful.");
        return lastCID;
    } catch (error) {
        console.error(error);
    }
}

function updateDBfile(newCID) {
    let dbObj = null;
    const jsonPath = process.env.BLOG_HOME + 'database.json';
    const jsonString = fs.readFileSync(jsonPath, { encoding: 'utf8', flag:'r'} );
    try {
        dbObj = JSON.parse(jsonString);
        dbObj.articles.push(newCID);
        const writeFile = fs.writeFileSync(jsonPath, JSON.stringify(dbObj, null, "  "));
        console.log("database.json updated.");
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    writeArticleFile: writeArticleFile,
    addSingleArticle: addSingleArticle,
    writeMetaJSON: writeMetaJSON,
    publishArticles: publishArticles,
    publishDatabase: publishDatabase
}