const router = require('express').Router();
const fs = require('fs');
const { exec } = require("child_process");
const { assert } = require('console');

require('dotenv').config();

router.post('/publish-article', async (req, res) => {
    try {
        writeArticleFile(req.body.content, req.body.folderNumber);

        let metaObj = {
            title: req.body.title,
            description: req.body.description,
            content: "article.md",
            cover: req.body.cover,
            created: new Date(),
            author: "Tester2"
        }

        writeMetaJSON(metaObj, req.body.folderNumber);
        let ipfsResponse = await addSingleArticle(req.body.folderNumber);
        // !! We are not waiting for previous operation to finish
        console.log("ipfsResponse: ", ipfsResponse)
        

        res.send("<h1>Article published.</h1>")
    } catch (error) {
        res.status(500).send("Server side error (publishArticle): " + err);
    }
});


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
    const path = process.env.BLOG_HOME + 'articles/' + folderNumber;
    exec("ipfs add -r " + path, async (error, stdout, stderr) => {    
        if (error) {
            console.log(`ERROR: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`STDERR: \n ${stderr}`);
        }
        let folderCID = extractLastCID(stdout);
        console.log("fold: ",  folderCID)        
        updateDBfile(folderCID);
        console.log("The article was added to IPFS");
    });
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

module.exports = router;