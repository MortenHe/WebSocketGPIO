#!/usr/bin/node
const WebSocket = require('ws');

//Mit WebsocketServer verbinden
const ws = new WebSocket('ws://localhost:8080');

const Gpio = require('onoff').Gpio;
const led = new Gpio(17, 'out');

//Button soll auf steigenden Wert reagieren (=Knopfdruck)
const buttonNext = new Gpio(4, 'in', 'rising', { debounceTimeout: 10 });

//4, 14, 15
console.log(led.readSync());

//Mit WSS verbinden
ws.on('open', function open() {
    console.log("logged")

    //Wenn Button gedrueckt wurd
    buttonNext.watch(function (err, value) {
        console.log("next track");

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