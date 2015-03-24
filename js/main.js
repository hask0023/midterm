// AIzaSyA8BTwbN0s9UfefqLk9vs32OSNJQz22Iag    - google maps key

//document.addEventListener("DOMContentLoaded", function(){

//document.addEventListener("deviceready", startApp);

document.addEventListener("DOMContentLoaded", function(){

    


    document.addEventListener("deviceready", startApp);
});
        
function startApp() {
  
 var storageContactsJSON = JSON.parse(contactString);
       
  
  if( navigator.geolocation ){ 
    
    var params = {enableHighAccuracy: true, timeout:5000, maximumAge:60000}; // timeout was 3600
   
    navigator.geolocation.getCurrentPosition( reportPosition, gpsError, params );
   
  
  }else{

    alert("Geolocation failed.");
  }

    
// hammer for list items 
  
//var listView = document.getElementById('listView');    
//var listHammer = new Hammer(listView);
//listHammer.on("doubletap", function(ev) {
//    alert ("Hello");
//});
    var element = document.getElementById("home");
    var hammertime = new Hammer(element);
    hammertime.on("tap", function(){
        console.log ("hello");
    });
    
//listHammer.on("doubletap", doubleTapList);
    

    
// Contacts    
var options = new ContactFindOptions();  
options.filter = ""; // keep empty to get all contacts
options.multiple = true;

var filter = ["displayName", "phoneNumbers"];
navigator.contacts.find(filter, onSuccess, onError, options);  
    
};

//});


function onSuccess(matches) {
// what to do with the contacts

  // alert ("Matches found");
    var contactInfo = matches;
    var contactLength = contactInfo.length;
    //only get 12 records?
    //matches.length = 12;
   
    if (contactInfo.length > 12) {
        contactInfo.length = 12;
    }
 //    document.getElementById("displaynames").innerHTML = contactInfo.length;
    
    
    
    for (var i=0; i<12; i++) 
    {
        
        contactInfo[i].lat = null;
        contactInfo[i].lng = null;
       
         
//        var currentName = JSON.stringify(matches[i].displayName);
//        var currentHomeNumber = JSON.stringify(matches[i].phoneNumbers[0].value);
//        var currentMobileNumber = JSON.stringify(matches[i].phoneNumbers[1].value);
//        var currentNameAndNumbers = currentName + currentHomeNumber + currentMobileNumber;
        
    //   document.getElementById("displaynames").innerHTML += storageObject;
       // document.getElementById("displaynames").innerHTML += currentNumbers;

    }
    var contactString = JSON.stringify(contactInfo);
    
    store("contacts", contactString);
     storageContactsJSON = JSON.parse(contactString);
    var storageContacts = store("contacts");
    var storageContactString = JSON.stringify(storageContacts);
    
    for (var j=0; j<12; j++){
    
    var createListItem = document.createElement("li");
//    var text = document.createTextNode(JSON.stringify(storageContacts[j].displayName));
        var text = document.createTextNode(storageContactsJSON[j].displayName);
    createListItem.appendChild(text); 
    createListItem.setAttribute("data-ref", j);
    document.getElementById("listView").appendChild(createListItem);
 
      
    }
    
}
    
function onError() {
alert ("Failed to get contact");
}


var map;
var marker;
var myLatlng;
var mapOptions;


//get gps position and make google map
function reportPosition( position ){ 
 
 //alert ("Should be making map");
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    myLatlng = new google.maps.LatLng(45.349356, -75.753222);

  mapOptions = {
        center: myLatlng,
        zoom: 8    
     };
     map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
 
      google.maps.event.addListener(map, 'dblclick', one);
 
}




function one(ev){
    
    var newLat = ev.latLng.lat() ;
    var newLong = ev.latLng.lng() ;
    alert(newLong);
    
    var m = new google.maps.Marker ({
        position: ev.latLng,
        title: "New location added!",
        animation: google.maps.Animation.BOUNCE
});
m.setMap(map);
}

function tapList(ev){
    //single tap list item, bring up popup window
    alert ("Single tap");
//    var infoToGet = ev.target.getAttribute("data-ref");
//    
//    document.querySelector("[data-role=popup]").style.display="block";
//    document.querySelector("[data-role=overlay]").style.display="block";
//    
//    document.getElementById("fullName").innerHTML = storageContactsJSON[infoToGet].displayName;
//    document.getElementById("homeNum").innerHTML = "Home Number: " + storageContactsJSON[infoToGet].phoneNumbers[0].value;
//    document.getElementById("mobileNum").innerHTML = "Mobile Number: " + storageContactsJSON[infoToGet].phoneNumbers[1].value;                                                                   
}

function doubleTapList() {
// double tap list item, change to map page
        document.getElementById("home").className = "";
        document.getElementById("map").className = "active";                                                                                     
                                                                    
}


function gpsError( error ){   
  var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}
 //   google.maps.event.addDomListener(window, 'load', initialize);






