//Mit WebsocketServer verbinden
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

//GPIO Bibliothek laden
const Gpio = require('onoff').Gpio;

//LED 16, 20, 21
const led = new Gpio(21, 'out');

//Wenn Verbindung mit WSS hergestellt wird
ws.on('open', function open() {
    console.log("connected to wss");

    //Wenn WS eine Nachricht von WSS empfaengt
    ws.on('message', function incoming(message) {

        //Nachricht kommt als String -> in JSON Objekt konvertieren
        var obj = JSON.parse(message);

        //Ausser bei Zeitaenderung
        if (obj.type !== "time") {
            console.log("received: " + obj.type);

            //LED kurz an
            led.writeSync(1);
            setTimeout(function () {
                led.writeSync(0);
            }, 200);
        }
    });
});