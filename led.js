//Mit WebsocketServer verbinden
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

//GPIO Bibliothek laden
const Gpio = require('onoff').Gpio;

//LED 16
const led = new Gpio(16, 'out');

//Wenn Verbindung mit WSS hergestellt wird
ws.on('open', function open() {
    console.log("connected to wss");

    //Wenn WS eine Nachricht von WSS empfaengt
    ws.on('message', function incoming(message) {

        //Nachricht kommt als String -> in JSON Objekt konvertieren
        var obj = JSON.parse(message);

        //Wenn aktueller Random-Wert geliefert wird
        if (obj.type === "toggle-random") {
            console.log("random is: " + obj.value);

            //LED an / aus
            led.writeSync(obj.value);
        }
    });
});