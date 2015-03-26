
var storageContactsJSON;

document.addEventListener("DOMContentLoaded", function(){
//override back button
   
    
        
var listView = document.getElementById('listView'); 
//var listHammer = new Hammer(listView);
//listHammer.on("tap", tapList);    
//listHammer.on("doubletap", doubleTapList);
    

    
 listHammer = new Hammer.Manager(listView, {});
var singleTap = new Hammer.Tap({event: 'singletap' });
var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2 });


listHammer.add([doubleTap, singleTap]);
doubleTap.recognizeWith(singleTap);
//doubleTap.requireFailure(singleTap);
singleTap.requireFailure(doubleTap);

listHammer.on("singletap", tapList);    
listHammer.on("doubletap", doubleTapList);
  
    
    var lat;
    var long;
    var cancelbtn = document.getElementById('cancelBtn');
    var cancelHammer = new Hammer(cancelbtn);
    cancelHammer.on("tap", tapCancel);
    
    var backbtn = document.getElementById('backBtn');
    var backHammer = new Hammer(backbtn);
    backHammer.on("tap", tapBack);
    
    


    document.addEventListener("deviceready", startApp);
});
        
function startApp() {
   
  history.replaceState(null, null, "#home");
 
       
  
  if( navigator.geolocation ){ 
    
    var params = {enableHighAccuracy: true, timeout:5000, maximumAge:60000}; // timeout was 3600
   
    navigator.geolocation.getCurrentPosition( reportPosition, gpsError, params );
   
  
  }else{

    alert("Geolocation failed.");
  }

    

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

   
    if (contactInfo.length > 12) {
        contactInfo.length = 12;
    }
 
    
    
    //take out unneeded info, put in lat and long
    for (var i=0; i<contactInfo.length; i++) 
    {
        delete contactInfo[i].rawId;
        delete contactInfo[i].name;
        delete contactInfo[i].nickname;
        delete contactInfo[i].emails;
        delete contactInfo[i].addresses;
        delete contactInfo[i].ims;
        delete contactInfo[i].organizations;
        delete contactInfo[i].birthday;
        delete contactInfo[i].note;
        delete contactInfo[i].photos;
        delete contactInfo[i].categories;
        delete contactInfo[i].urls;
       
        contactInfo[i].lat = null;
        contactInfo[i].lng = null;
    
    }

    
        
  //  });
    // local storage stuff
    var contactString = JSON.stringify(contactInfo);

    localStorage.setItem("contacts", contactString);
  
    var rawStorage = localStorage.getItem("contacts");
     storageContactsJSON = JSON.parse(rawStorage);
    
//    var storageContactsJSON = JSON.parse(contactString);
    
    
    for (var j=0; j<contactInfo.length; j++){
   
    var createListItem = document.createElement("li");

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
var markerPositionLat;
var markerPositionLong;
var markerPosition;

//get gps position 
function reportPosition( position ){ 
 
 // found positions
     lat = position.coords.latitude;
     long = position.coords.longitude;
 
}






function tapList(ev){
    //single tap list item, bring up popup window
   // console.log ("Single tap");
    history.pushState(null, null, "#pop-up");
    
    
    var infoToGet = ev.target.getAttribute("data-ref");
    
    document.querySelector("[data-role=pop-up]").style.display="block";
    document.querySelector("[data-role=overlay]").style.display="block";
    
    document.getElementById("fullName").innerHTML = storageContactsJSON[infoToGet].displayName;
    document.getElementById("homeNum").innerHTML = "Home: " + storageContactsJSON[infoToGet].phoneNumbers[0].value;
    document.getElementById("mobileNum").innerHTML = "Mobile: " + storageContactsJSON[infoToGet].phoneNumbers[1].value;                                                                   
}

var positionInfotoget;

function doubleTapList(ev) {
    
    history.pushState(null, null, "#map");
    
// double tap list item, change to map page
      
   positionInfotoget = ev.target.getAttribute("data-ref");
      
   // alert ("Double tap"); 
    
    document.getElementById("home").className = "";
    document.getElementById("map").className = "active";
    
    
 
      if (marker){
          marker.setMap(null);
      }
    
    if (storageContactsJSON[positionInfotoget].lat === null) {
        //no marker
       
       alert ("No coordinates are set for this contact. Double tap on the map to set coordinates.");
            myLatlng = new google.maps.LatLng(lat, long);

  mapOptions = {
        center: myLatlng,
        zoom: 8    
     };
     map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
 
      google.maps.event.addListener(map, 'dblclick', one); 
        
        
    }
    else{
       
//         positionInfotoget = ev.target.getAttribute("data-ref");
//        alert("ITS NOT NULL YAY!");
      //  alert (storageContactsJSON[positionInfotoget].lng);
     markerPositionLat = storageContactsJSON[positionInfotoget].lat;
     markerPositionLong = storageContactsJSON[positionInfotoget].lng;
    markerPosition = new google.maps.LatLng(markerPositionLat, markerPositionLong);
//        alert (markerPosition);
     myLatlng = new google.maps.LatLng(lat, long);
// rebuild with the location
       mapOptions = {
        center: markerPosition,
        zoom: 8    
     };
     map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        
        marker = new google.maps.Marker ({
            position: markerPosition,
            animation: google.maps.Animation.BOUNCE
//marker.setPosition(markerPosition);
        });
        marker.setMap(map);

    }
                                                               
}


function one(eve){
    // marker.setMap(null);
    var newLat = eve.latLng.lat() ;
    var newLong = eve.latLng.lng() ;
   // console.log("marker adde new loc to index: " +positionInfotoget);
    storageContactsJSON[positionInfotoget].lat = newLat;
    storageContactsJSON[positionInfotoget].lng = newLong;
    
    var contactString = JSON.stringify(storageContactsJSON);
    localStorage.setItem("contacts", contactString);

     marker = new google.maps.Marker ({
        position: eve.latLng,
        title: "New location added!",
        animation: google.maps.Animation.BOUNCE
});

    marker.setMap(map);
}

function tapBack() {
     document.getElementById("home").className = "active";
    document.getElementById("map").className = "";
}

function tapCancel() {
     document.querySelector("[data-role=pop-up]").style.display="none";
    document.querySelector("[data-role=overlay]").style.display="none";
}




function gpsError( error ){   
  var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}


    
//document.addEventListener("backbutton", onBackKeyDown, false);
//
//function onBackKeyDown(e) {
//    e.preventDefault();
//    document.getElementById("home").className = "active";
//    document.getElementById("map").className = "";
//    document.querySelector("[data-role=pop-up]").style.display="none";
//    document.querySelector("[data-role=overlay]").style.display="none";
//}

window.addEventListener("popstate", onBackKeyDown);

function onBackKeyDown() {
  
    document.getElementById("home").className = "active";
    document.getElementById("map").className = "";
    document.querySelector("[data-role=pop-up]").style.display="none";
    document.querySelector("[data-role=overlay]").style.display="none";
}


