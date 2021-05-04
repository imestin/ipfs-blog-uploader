const fs = require('fs');
const exec = require('await-exec');
const { assert } = require('console');
require('dotenv').config();


async function resolveIPNSAddresses() {
    try {
        let currentSiteCID = await exec(`ipfs name resolve ${process.env.IPNS_SITE}`);
        let currentArticlesCID = await exec(`ipfs name resolve ${process.env.IPNS_ARTICLES}`);
        let lastDBCID = await exec(`ipfs name resolve ${process.env.IPNS_DB}`);

        assert(currentSiteCID.stdout.includes('/ipfs/'), "Return value for SiteCID does not contain '/ipfs/'");
        assert(currentArticlesCID.stdout.includes('/ipfs/'), "Return value for ArticlesCID does not contain '/ipfs/'");
        assert(lastDBCID.stdout.includes('/ipfs/'), "Return value for DBCID does not contain '/ipfs/'");
        
        return {
            currentSiteCID: cleanText(currentSiteCID.stdout), 
            currentArticlesCID: cleanText(currentArticlesCID.stdout), 
            lastDBCID: cleanText(lastDBCID.stdout)
        };
    } catch (error) {
        console.error("Return value of 'ipfs name resolve' is not correct: ");
    }
}

function cleanText(text) {
    text = text.replace('/ipfs/', '');
    text = text.replace('\n', '');

    return text;
}

module.exports = {
    resolveIPNSAddresses: resolveIPNSAddresses,
}