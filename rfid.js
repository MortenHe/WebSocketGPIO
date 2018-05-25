//Mit WebsocketServer verbinden
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

//Je nach Ausfuerung audio oder video Karten aus config laden
const mode = process.argv[2] ? process.argv[2] : "audio";

//Datei lesen
const fs = require('fs-extra');

//Wert RFID-Karten aus config.json auslesen
const configObj = fs.readJsonSync('./config.json');

//RFID Bibliothek laden
//var rfid = require('node-rfid');

//Wenn Verbindung mit WSS hergestellt wird
ws.on('open', function open() {
    console.log("connected to wss");

    //RFID-Karte lesen
    /*
    rfid.read(function (err, id) {
    
        //Fehler?
        if (err) {
            console.log("Sorry, some hardware error occurred");
        }
    
        //print rfid tag UID
        console.log(id);
    });*/

    let id = 278820847058

    //Karten-Daten auslesen aus Config
    let cardData = configObj[mode][id];

    //MessageObjekt mit Info welche Audioplaylist / Video gespielt werden soll
    let messageObj = {
        mode: cardData.mode,
        path: cardData.path,
    }

    //gewisse Werte untescheiden sich pro Modus
    if (mode === "audio") {

        //ist Random erlaubt in dieser Playlist
        messageObj.allowRandom = cardData.allowRandom;
    }

    //bei Video
    else {

        //Mit welchem Namen soll die Datei dargestellt werden
        messageObj.name = cardData.name;

        //Bei Videos immer ein Array schicken (weil es in der Web-Oberflaeche auch die Moeglichkeit gibt eine Liste von Video zu schicken)
        messageObj = [messageObj];
    }

    //Nachricht an WSS schicken
    ws.send(JSON.stringify({
        type: "set-rfid-playlist",
        value: messageObj
    }));
});