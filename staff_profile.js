import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase, ref, push, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

const appsettings = {
    databaseURL: "https://sample-7ef53-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appsettings)
const database = getDatabase(app)
const BUSESRef = ref(database, "live");

let busRef = null; // Store reference to the bus node
var bus_id = localStorage.getItem('routescheduleid_staff');
console.log(bus_id)


// Function to push latitude and longitude to Firebase
function pushLocationToFirebase(latitude, longitude) {
    if (!busRef) {
        busRef = push(BUSESRef); // Store the reference to the bus node if not already set
    }

    update(busRef, {
        latitude: latitude,
        longitude: longitude,
        bus_name: bus_id,
        status: "updated3"
    });
}

function UpdateLocation(latitude, longitude) {
    if (busRef) {
        update(busRef, {
            latitude: latitude,
            longitude: longitude,
            status: "updated"
        });
    } else {
        console.error("No bus data found.");
    }
}

var latitude;
var longitude;
let watchId;
function getLocation() {
    if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                console.log('User position:', position.coords);
                // Here you can send the position to the server or do something elsea
                pushLocationToFirebase(position.coords.latitude, position.coords.longitude);
                UpdateLocation(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error('Error getting user position:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000, // 5 seconds
                maximumAge: 0
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

function stopTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        console.log('Tracking stopped');
    }
}
getLocation();
setInterval(() => getLocation(), 4000);
