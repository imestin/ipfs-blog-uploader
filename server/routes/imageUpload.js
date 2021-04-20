const router = require('express').Router();
fs = require('fs');
require('dotenv').config();

router.post('/upload-image', async (req, res) => {
    try {
        if(!req.files) {
            console.log("not found")
            res.send({
                status: false,
                message: "No file uploaded"
            });
        } else {
            let image = req.files.image;
            let folderPath = process.env.BLOG_HOME + 'articles/' + req.body.folderNumber;
            image.mv(folderPath + '/' + image.name);
            let fileList = fs.readdirSync(folderPath);
            res.send({
                status: true,
                message: "File is uploaded",
                data: {
                    name: image.name,
                    mimetype: image.mimetype,
                    size: image.size,
                    folderContents: fileList
                }
            });
        }
    } catch (err) {
        res.status(500).send("Server side error (imageUpload): " + err);
    }
})

module.exports = router;