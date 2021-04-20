console.log("Szia!")

suggestFolderName();


async function suggestFolderName() {
    // Server will check for next non-existent directory
    let serverResponse = await fetch('http://localhost:3000/give-next-number')
        .then(resp => resp.json())
        .catch((err) => console.error("Error", err));
    document.getElementById("imgFolderNumber").value = serverResponse.nextFolder;
    document.getElementById("articleFolderNumber").value = serverResponse.nextFolder;
}


// Handle image upload
var imageUploadForm = document.getElementById("image-upload");
imageUploadForm.onsubmit =  async function imageUpload(event) {
    event.preventDefault();
    let folderNumber = event.target.folderNumber.value;
    let image = event.target.image.files[0];
    
    // Create Axios form
    const formData = new FormData();
    formData.append('image', image);
    formData.append('folderNumber', folderNumber);
    
    
    axios.post('http://localhost:3000/upload-image', formData, {
        onUploadProgress: (ProgressEvent) => {
            let progress = Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
            console.log("progress: " + progress)
            document.getElementById("imageUploadStatus").innerText = progress;
        }
    }).then(resp => {
        //this.imagePath = resp.data.path;
        console.log("files in directory: ", resp.data.data.folderContents);
        listCoverOptions(resp.data.data.folderContents)
        document.getElementById("imageUploadStatus").innerText = "Done.";
    })
    
}


function listCoverOptions(filesArray) {
    let dropdown = document.getElementById("articleCoverSelect");
    dropdown.innerHTML = "";                            // Avoid duplicating <option> entries
    for (let i = 0; i < filesArray.length; i++) {
        let tempNode = document.createElement("option");
        tempNode.appendChild(document.createTextNode(filesArray[i]))
        dropdown.appendChild(tempNode);
    }
}


