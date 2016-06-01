console.log('index.js')

function showStatus(msg) {
    document.getElementById('status').innerText = msg
}

function noDirectory() {
    document.getElementById('nodirectory').style.display='block'
}

function addFolder() {
    chrome.mediaGalleries.addUserSelectedFolder(function(d){console.log('added folder',d)})
}
function chooseFolders() {
    chrome.mediaGalleries.getMediaFileSystems({interactive:"yes"},function(d){console.log('selected folders',d)})
}

function onStart() {
    // get opts for starting

    chrome.app.window.get('index').close();
    var rndcheck = 0;
    if ($('#rnd').is(':checked')) {
      rndcheck = 1;
    }
    chrome.app.window.create('slideshow.html?all=true&random='+rndcheck+'&delay='+$('#delay').val(),{id:'slideshow'});
    
}

function restoreDirectory(callback) {
    chrome.storage.local.get('directory', function(result) {
	console.log('restore',result)
	if (result && result.directory) {

	} else {
	    noDirectory()
	}
    })
}

document.addEventListener("DOMContentLoaded",function(){
    document.getElementById('addfolder').addEventListener('click',addFolder)
    document.getElementById('start').addEventListener('click',onStart)
    document.getElementById('choosefolders').addEventListener('click',chooseFolders)
    chrome.mediaGalleries.getMediaFileSystems({interactive:"no"},function(d){
	console.log(d)

	if (d) { console.log('have media galleries',d) }
    })

    chrome.mediaGalleries.getAllMediaFileSystemMetadata( function(d){
	console.log('all metadata',d)
    })

})

function reload() { chrome.runtime.reload() }
