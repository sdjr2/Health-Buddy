/*Initialize our connection to FireBase*/
var db;

(function initFireBase(){
	var firebaseConfig = {
		apiKey: "AIzaSyCnuH7MAWGCHxJjI6nprVOXFzHb-JoME_Y",
		authDomain: "health-buddy-53e8c.firebaseapp.com",
		databaseURL: "https://health-buddy-53e8c.firebaseio.com",
		projectId: "health-buddy-53e8c",
		storageBucket: "health-buddy-53e8c.appspot.com",
		messagingSenderId: "675400900634",
		appId: "1:675400900634:web:d5214388f1c7cafa00f1a3"
	};
	  
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	db = firebase.firestore();
})();

/*Checks if a patient document already exists in
our firebase db, given the patient's id code*/
function checkPatientExists(patientId, callback){
	var doc = db.collection("patient-updates").doc(patientId);
	
	//Try to read the specified path from the db and check existence
	doc.get().then(function(doc) {
		callback(doc.exists);
	}).catch(function(err) {
		console.log(err);
	});
}

/*Adds a test patient report to the firebase db
given the patient's id and the statusObject. The
statusObject is the results of the form submission.*/
function addPatientStatus(patientId, statusObject, callback){
	var doc = db.collection("patient-updates").doc(patientId);
	
	//Check if the patient exists to decide how to add data
	checkPatientExists(patientId, function(exists){
		
		//If the patient already exists just add their latest status into their array of statuses
		if(exists){
			doc.update({
				statuses: firebase.firestore.FieldValue.arrayUnion(statusObject)
			})
			.then(callback)
			.catch(function(err){console.log(err)});
		} 
		//Otherwise create a new patient
		else {
			doc.set({
				statuses: [statusObject]
			}).catch(function(err){console.log(err)});
		}
	});
}

/*TODO: Retrieves the patient's id from a cookie*/
function getPatientId(){
	return "p1";
}

/*Gets the values of the form fields and returns them as a JSON object*/
function getFormData(){

	var typeOfUpdate = $("#updateTypeSelect").val();
	var timeOfUpdate = $("#dateTimePicker").datetimepicker("getValue");
	var details = $("#updateDetails").val();
	
	var statusObject = {
		"typeOfUpdate": typeOfUpdate,
		"timeOfUpdate": timeOfUpdate,
		"details": details
	};

	return statusObject;
}

/*Redirects the page to view all the patient's status updates*/
function redirectToStatus(){
	window.location.replace('update-view.html');
}

/*Retrieves the filled in form data and the patients id
and send the info to FireBase*/
function sendFormData(){
	var patientId = getPatientId();
	var statusObject = getFormData();
	
	addPatientStatus(patientId, statusObject, redirectToStatus);
}