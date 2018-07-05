//Mit WebsocketServer verbinden
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

//GPIO Bibliothek laden
const Gpio = require('onoff').Gpio;

//LEDs anlegen
const led_10 = new Gpio(21, 'out');
const led_20 = new Gpio(26, 'out');
const led_30 = new Gpio(19, 'out');
const led_40 = new Gpio(13, 'out');
const led_50 = new Gpio(16, 'out');
const led_60 = new Gpio(12, 'out');
const led_70 = new Gpio(5, 'out');
const led_80 = new Gpio(7, 'out');
const led_90 = new Gpio(24, 'out');
const led_100 = new Gpio(22, 'out');

//LEDs in Array verwalten
const ledArray = [led_10, led_20, led_30, led_40, led_50, led_60, led_70, led_80, led_90, led_100];

//Wenn Verbindung mit WSS hergestellt wird
ws.on('open', function open() {
    console.log("connected to wss");

    //Wenn WS eine Nachricht von WSS empfaengt
    ws.on('message', function incoming(message) {

        //Nachricht kommt als String -> in JSON Objekt konvertieren
        var obj = JSON.parse(message);

        //Wenn aktueller Lautstaerke-Wert geliefert wird
        if (obj.type === "change-volume") {

            //erstmal alle LEDs ausmachen
            ledArray.forEach(led => {
                led.writeSync(0);
            });

            //wie viele der LEDs anmachen? 60 / 10 = 6 => LED 1-6 anschalten
            let steps = obj.value / 10;
            console.log("turn on until LED: " + steps);

            //Ueber die LEDs gehen, die an sein sollen und diese anschalten
            for (let i = 0; i < steps; i++) {
                ledArray[i].writeSync(1);
            }
        }
    });
});