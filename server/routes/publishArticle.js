const router = require('express').Router();
const { assert } = require('console');
const { writeArticleFile, writeMetaJSON, addSingleArticle, publishArticles, publishDatabase } = require('../utils/createArticle');

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
        res.send("<h3 style='color: green'>The server added the article to IPFS, but they are not published yet to the IPNS link. They should be published in 5-10 minutes.</h3>")
        assert(ipfsResponse === 0, "Error in addSingleArticle function");

        await publishArticles();
        await publishDatabase();
    } catch (error) {
        res.status(500).send("Server side error (publishArticle): " + error);
    }
});


module.exports = router;