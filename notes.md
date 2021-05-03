# Generate

### 1) Generate new key
   `ipfs key gen -t rsa -s 4096 BlogNameDB` 
   `ipfs key gen -t rsa -s 4096 BlogNameArticles`
   `ipfs key gen -t rsa -s 4096 BlogNameSite`


### 2) Save the key identifiers
   `echo "k2k4EXAMPLEXxWZ9dbd3d7cuQTok9RT3FZe61TEvFIRST" > TesterDB.asc`
   `echo "k2k4EXAMPLEyXxWZ9dbd3d7cuQTok9RT3FZe61TEsvSECOND" > TesterArticles.asc`
   `echo "k2k4EXAMPLEyXxWZ9dbd3d7cuQTok9RTFZe61TEvTHIRD" > TesterSite.asc`

### 3) Edit website
   generate `helper_beginner.md` and `helper_advanced.md`, edit the styles, etc.


### 4) Add the website to IPFS
   `ipfs add -r ./website/`


### 5) Publish website
   `ipfs name publish --key=TesterSite /ipfs/QmEXAMPLEyXxWZ9dbd3d7cuQTok9RTFZe61TEvTHIRD`


### 6) Create articles
   Articles  are folders with an `article.md` file, a `meta.json` and optional pictures.
   `meta.json` needs to link to front image. 
   The article folder should be added to IPFS individually, to save the CID to `database.json`.
   After that, the whole folder (articles) should be added to IPFS, the subfolder will have the same CID.
   This can be done in 1 step, but look for CIDs of the individual articles. (`ipfs add -r DataFolder/articles/`)


### 7) Edit `database.json`
   The articles need to exist in the database file, add the CIDs to the array.
   `ipfs add DataFolder/database.json`


### 8) Publish database
   `ipfs name publish --key=[BlogName]DB /ipfs/QmRLigRxxMVett9Af1mViTz994ovJtDjHiRnArelso`


### 9) Publish articles folder
   `ipfs name publish --key=[BlogName]Articles /ipfs/QmRLigRxxMVett9Af1mViTz994ovJtDjHiRnArmasodik`



# Update

### 1) Create new article
   Articles  are folders with an `article.md` file, a `meta.json` and optional pictures.
   `meta.json` needs to link to front image.
   The article folder should be added to IPFS individually, to save the CID to `database.json`.
   After that, the whole folder (articles) should be added to IPFS, the subfolder will have the same CID.
   This can be done in 1 step, but look for CIDs of the individual articles. (`ipfs add -r DataFolder/articles/`)


### 2) Edit `database.json`
   The new article needs to exist in the database file, add the CID to the array.
   `ipfs add DataFolder/database.json`

### 3) Republish articles folder
   `ipfs name publish --key=BlogNameArticles /ipfs/QmRLigRxxMVett9Af1mViTz994ovJteznemugyanazacid`


### 4) Republish database
   `ipfs name publish --key=BlogNameDB /ipfs/QmRLigRxxMVett9Af1mViTz994ovezsemugyanazacid`


