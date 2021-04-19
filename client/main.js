console.log("Szia!")


async function suggestFolderName() {
    let serverResponse = 3;
    //async
    console.log("I think you should be " + serverResponse + " as folder name." );
    document.getElementById("imgFolderNumber").placeholder = serverResponse;
    document.getElementById("articleFolderNumber").placeholder = serverResponse;
}

async function getUploadStatus() {
    //async
    document.getElementById("imageUploadStatus").innerText = "0%";
}

async function listCoverOptions() {
    let dropdown = document.getElementById("articleCoverSelect");
    //async
    for (let i = 0; i < 3; i++) {
        let tempNode = document.createElement("option");
        tempNode.appendChild(document.createTextNode("file" + i + ".jpg"))
        dropdown.appendChild(tempNode);
    }
}

suggestFolderName();
getUploadStatus();
listCoverOptions();

/**
 * Select Article Number
 * Upload as many images as you wish
 * 
 * Server sends response OK
 * Select Article Number
 * Select Article Name
 * Select Description
 * You select an image for cover
 * Insert markdown
 * PUBLISH
 * 
 */