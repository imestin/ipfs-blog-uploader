const router = require('express').Router();
const fs = require('fs');
require('dotenv').config();


router.get('/give-next-number', async (req, res) => {
    try {
        let nextArticleFolder = 0;
        while (isFolderExist(nextArticleFolder)) {
            nextArticleFolder++;
        }

        res.json({
            nextFolder: nextArticleFolder
        });
    } catch (error) {
        res.status(500).send("Server side error: " + error);
    }
});

function isFolderExist(folderNumber) {
    if (fs.existsSync(process.env.BLOG_HOME + folderNumber)) {
        return true;
    } else {
        return false;
    }
}

module.exports = router;