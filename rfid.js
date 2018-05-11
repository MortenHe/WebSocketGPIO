//Mit WebsocketServer verbinden
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

//RFID Bibliothek laden
//var rfid = require('node-rfid');


//Wenn Verbindung mit WSS hergestellt wird
ws.on('open', function open() {
    console.log("connected to wss");

    //RFID-Karte lesen
    /*
    rfid.read(function (err, result) {
    
        //Fehler?
        if (err) {
            console.log("Sorry, some hardware error occurred");
        }
    
        //print rfid tag UID
        console.log(result);
    });*/

    //Nachricht an WSS schicken
    ws.send(JSON.stringify({
        type: "set-rfid-playlist",
        value: 278820847058
    }));
});