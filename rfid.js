//RFID Bibliothek laden
var rfid = require('node-rfid');

//RFID-Karte lesen
rfid.read(function (err, result) {

    //Fehler?
    if (err) {
        console.log("Sorry, some hardware error occurred");
    }

    //print rfid tag UID
    console.log(result);
});