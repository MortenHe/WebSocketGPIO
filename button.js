#!/usr/bin/node
const WebSocket = require('ws');

//Mit WebsocketServer verbinden
const ws = new WebSocket('ws://localhost:8080');

//GPIO Bibliothek laden
const Gpio = require('onoff').Gpio;

//Button soll auf steigenden Wert reagieren (=Knopfdruck)
const buttonNext = new Gpio(4, 'in', 'rising', { debounceTimeout: 10 });
//Buttons 4, 14, 15

//LED anlegen
const led = new Gpio(21, 'out');
//LED 16, 20, 21

//Wenn Verbindung mit WSS hergestellt wird
ws.on('open', function open() {
    console.log("logged")

    //Wenn Button gedrueckt wurd
    buttonNext.watch(function (err, value) {
        console.log("next track");

        //LED an fur 0,5 sek
        led.writeSync(1);
        setTimeout(function () {
            led.writeSync(0);
        }, 500);

        //Nachricht an WSS schicken
        ws.send(JSON.stringify({
            type: "change-song",
            value: true
        }));
    });
});