//Mit WebsocketServer verbinden
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

//Rotary laden
var raspi = require('raspi');
var RotaryEncoder = require('raspi-rotary-encoder').RotaryEncoder;

//Wenn Verbindung mit WSS hergestellt wird
ws.on('open', function open() {
    console.log("connected to wss");

    //Rotary anlegen mit passenden PINs
    raspi.init(function () {
        var encoder = new RotaryEncoder({
            pins: { a: "GPIO17", b: "GPIO18" },
            pullResistors: { a: "up", b: "up" }
        });

        //Bei Aenderung des Wertes
        encoder.addListener('change', function (evt) {
            console.log('Count', evt.value);
            let value = evt.value ? true : false;

            //Nachricht an WSS schicken
            ws.send(JSON.stringify({
                type: "change-volume",
                value: value
            }));
        });
    });
});