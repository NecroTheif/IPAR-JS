// Get the filesystem
window.requestFileSystemSync  = window.requestFileSystemSync || window.webkitRequestFileSystemSync;

document.addEventListener('DOMContentLoaded', function() {
	
	// Make sure the need APIs are supported
	if(!window.File || !window.FileReader || !window.FileList || !window.Blob || !window.ArrayBuffer || !window.Worker){
		alert('The File APIs need to load files are not supported in this browser!');
		document.getElementById("load-button").disabled = true;
	}
	else{
		// Get the load button and input
		var loadInput = document.getElementById('load-input');
		var loadButton = document.getElementById('load-button');
		
		// When click the load button call the load input
		loadButton.onclick = function() {
			loadInput.click();
		}
		
		// When load input choosen load the file
		loadInput.addEventListener('change', function(event){
			
			// Set the button to disabled so that it can't be pressed while loading
			loadButton.disabled = true;
			loadInput.disabled = true;
			
			// Create a reader and read the zip
			var reader = new FileReader();
			reader.onload = function(event){
				
				// Create a worker for unzipping the file
				var zipWorker = new Worker("js/unzip.js");
				zipWorker.onmessage = function(message) {
					
					// Save the urls to localstorage
					window.localStorage['caseFiles'] = message.data;
					
					// Redirect to the next page
					document.location = "case.html";
					
				}
				
				// Start the worker
				zipWorker.postMessage(event.target.result);
				
			};
			reader.readAsArrayBuffer(event.target.files[0]);
			
		}, false);
	}

});