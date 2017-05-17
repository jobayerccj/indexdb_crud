//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var db;

//create new database
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function(event) {
console.log("error: ");
};

request.onsuccess = function(event) {
db = request.result;
console.log("successfully created "+ db);
};

request.onupgradeneeded = function(event) {
var db = event.target.result;

//create new object store inside db for storing data without auto incremental id
//var objectStore = db.createObjectStore("employee", {keyPath: "id"});

//create new object store inside db for storing data with auto incremental id
var objectStore = db.createObjectStore("employee", {keyPath: "id", autoIncrement: true});

}

function read() {
    var transaction = db.transaction(["employee"]);
    var objectStore = transaction.objectStore("employee");
    var request = objectStore.get("00-03");
    
    request.onerror = function(event) {
       alert("Unable to retrieve daa from database!");
    };
    
    request.onsuccess = function(event) {
       // Do something with the request.result!
       if(request.result) {
          alert("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
       }
       
       else {
          alert("Kenny couldn't be found in your database!");
       }
    };
}
         
function readAll() {
var objectStore = db.transaction("employee").objectStore("employee");

objectStore.openCursor().onsuccess = function(event) {
   var cursor = event.target.result;
   
   if (cursor) {
      alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
      cursor.continue();
   }
   
   else {
      alert("No more entries!");
   }
};
}
         
function add() {
	var request = db.transaction(["employee"], "readwrite")
	.objectStore("employee")
	.add({ name: "Kenny", age: 19, email: "kenny@planet.org" });

	request.onsuccess = function(event) {
	   alert("Kenny has been added to your database.");
	};

	request.onerror = function(event) {
	   alert("Unable to add data\r\nKenny is aready exist in your database! ");
	}
}
         
function remove() {
	var request = db.transaction(["employee"], "readwrite")
	.objectStore("employee")
	.delete("00-03");

	request.onsuccess = function(event) {
	   alert("Kenny's entry has been removed from your database.");
	};
}

function update_OR_add(data) {

	var transaction = db.transaction(["employee"], "readwrite");
    var objectStore = transaction.objectStore("employee");
    
    var new_data = JSON.parse(data);
    console.log(typeof new_data[0]['id']);

    /* for auto incremetal field addition*/
    if(typeof new_data[0]['id'] == 'undefined'){
    	objectStore.add(new_data[0]);
    }
    else{
    	var request = objectStore.get(new_data[0]['id']);

	    request.onsuccess = function(event) {

			if(request.result) {
					objectStore.put(new_data[0]);
					alert('data found');
		       }
		       
		       else {
		          alert("data not found");
		          objectStore.add(new_data[0]);
	       }
	    }

		request.onerror = function(event) {
		   alert("Unable to add data\r\nKenny is aready exist in your database! ");
		}
    }

    
}