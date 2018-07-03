//Mit WebsocketServer verbinden
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

//Je nach Ausfuerung audio oder video Karten aus config laden
const mode = process.argv[2] ? process.argv[2] : "audio";

//Config-Datei lesen
const fs = require('fs-extra');

//Wert RFID-Karten aus config.json auslesen
const configObj = fs.readJsonSync('./config.json');

//RFID Bibliothek laden
var rc522 = require("rc522");

//Doppelaufruf verhindern, indem sich die aktuelle Karten-ID gemerkt wird
var currentId = "";

//Wenn Verbindung mit WSS hergestellt wird
ws.on('open', function open() {
    console.log("connected to wss");

    //Wenn ein RFID-Karte ausgelesen wurde
    rc522(function (rfidSerialNumber) {
        console.log("detected id: " + rfidSerialNumber);

        //Wenn Karten-ID in Config vorkommt
        if (configObj[mode][rfidSerialNumber] !== undefined) {

            //Wenn es eine neue Karte ist
            if (rfidSerialNumber !== currentId) {
                console.log("id is new: " + rfidSerialNumber);

                //neue Karte merken
                currentId = rfidSerialNumber;

                //Karten-Daten auslesen aus Config
                let cardData = configObj[mode][rfidSerialNumber];

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
            }

            //gleiche Karte wurde wieder an Reader gehalten
            else {
                console.log("id again: " + rfidSerialNumber);
            }
        }

        //Karten-ID ist nicht in Config
        else {
            console.log("id not in config: " + rfidSerialNumber);
        }
    });
});