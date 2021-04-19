const router = require('express').Router();
const fs = require('fs');
require('dotenv').config();

router.post('/publish-article', async (req, res) => {
    res.redirect('./published.html');
});

module.exports = router;