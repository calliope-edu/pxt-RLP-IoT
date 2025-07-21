/**
 * Functions to operate Grove module.
 */
//% weight=10 color=#9F79EE icon="\uf1b3" block="IoT-WiFi"
namespace iot_wifi {
    /**
 *
 */
    let isWifiConnected = false;
    /**
     * Setup Grove - Uart WiFi V2 to connect to  Wi-Fi
     */
    //% block="Setup Wifi|TX %txPin|RX %rxPin|Baud rate %baudrate|SSID = %ssid|Password = %passwd"
    //% block.loc.de="Wifi Verbindung herstellen |TX %txPin|RX %rxPin|Baud rate %baudrate|SSID = %ssid|Password = %passwd"
    //% txPin.defl=SerialPin.C17
    //% rxPin.defl=SerialPin.C16
    //% baudRate.defl=BaudRate.BaudRate115200
    export function setupWifi(txPin: SerialPin, rxPin: SerialPin, baudRate: BaudRate, ssid: string, passwd: string) {
        let result = 0

        isWifiConnected = false

        serial.redirect(
            txPin,
            rxPin,
            baudRate
        )

        sendAtCmd("AT")
        result = waitAtResponse("OK", "ERROR", "None", 1000)

        sendAtCmd("AT+CWMODE=1")
        result = waitAtResponse("OK", "ERROR", "None", 1000)

        sendAtCmd(`AT+CWJAP="${ssid}","${passwd}"`)
        result = waitAtResponse("WIFI GOT IP", "ERROR", "None", 20000)

        if (result == 1) {
            isWifiConnected = true
        }
    }

    /**
     * Check if Grove - Uart WiFi V2 is connected to Wifi
     */
    //% block="Wifi OK?"
    //% block.loc.de="Wifi Verbindung hergestellt?""
    export function wifiOK() {
        return isWifiConnected
    }

    let ThingsboardAdresse = "paminasogo.ddns.net"
    let ThingsboardPort = "9090"
    /**
      * Send data to Thingsboard
      */
    //% block="Send Data to your Thingsboard Server|Token %AccessToken|Daten_1 %Daten1||Daten_2 %Daten2|Daten_3 %Daten3|Daten_4 %Daten4|Daten_5 %Daten5|Daten_6 %Daten6|Daten_7 %Daten7|Daten_8 %Daten8"
    //% block.loc.de="Schicke Daten zu deinem Thingsboard Server|Token %AccessToken|Daten_1 %Daten1||Daten_2 %Daten2|Daten_3 %Daten3|Daten_4 %Daten4|Daten_5 %Daten5|Daten_6 %Daten6|Daten_7 %Daten7|Daten_8 %Daten8"
    //% expandableArgumentMode="enabled"
    //% AccessToken.defl="API Token(Thingsboard)"
    //% weight=10
    export function sendToThingsboard(AccessToken: string, Daten1: number = 0.0, Daten2: number = 0.0, Daten3: number = 0.0, Daten4: number = 0.0, Daten5: number = 0.0, Daten6: number = 0.0, Daten7: number = 0.0, Daten8: number = 0.0) {
        let result = 0
        let retry = 2
        basic.showString(ThingsboardAdresse);
        basic.showString(ThingsboardPort);
        let data: { [key: string]: number } = {
            "Daten1": Daten1,
            "Daten2": Daten2,
            "Daten3": Daten3,
            "Daten4": Daten4,
            "Daten5": Daten5,
            "Daten6": Daten6,
            "Daten7": Daten7,
            "Daten8": Daten8
        }


        // close the previous TCP connection
        if (isWifiConnected) {
            sendAtCmd("AT+CIPCLOSE")
            waitAtResponse("OK", "ERROR", "None", 200) //vorher 2000
        }

        const payload = JSON.stringify(data);
        const request = `POST /api/v1/${AccessToken}/telemetry HTTP/1.1\r\n` +
            `Host: ${ThingsboardAdresse}\r\n` +
            `Content-Type: application/json\r\n` +
            `Content-Length: ${payload.length}\r\n\r\n` +
            `${payload}`;

        while (isWifiConnected && retry > 0) {
            retry = retry - 1;

            sendAtCmd(`AT+CIPSTART="TCP","${ThingsboardAdresse}",${ThingsboardPort}\r\n`);
            result = waitAtResponse("OK", "ALREADY CONNECTED", "ERROR", 200) //vorher 2000
            if (result == 3) continue

            sendAtCmd(`AT+CIPSEND=${request.length}\r\n`);
            result = waitAtResponse(">", "OK", "ERROR", 200) //vorher 2000
            if (result == 3) continue

            sendAtCmd(request);
            result = waitAtResponse("SEND OK", "SEND FAIL", "ERROR", 200) //vorher 5000
            if (result == 1) break

            // close the previous TCP connection
            if (isWifiConnected) {
                sendAtCmd("AT+CIPCLOSE")
                waitAtResponse("OK", "ERROR", "None", 200) //vorher 2000
            }


        }
    }
    /**
    * Set thingsboard adress and port
    */
    //% block="Change thingsboard Server %Serveradresse|adress %Port|port"
    //% block.loc.de="Ändere Thingsboard Server zu %Serveradresse|adress %Port|port""
    //% adress.defl="paminasogo.ddns.net"
    //% port.defl="9090"
    //% weight=8
    export function setThingsboardServer(adress: string, port: string){
    ThingsboardAdresse = adress;
    ThingsboardPort = port;
    }
    
    /**
     * Send data to ThinkSpeak
     */
    //% block="Send Data to your ThinkSpeak Channel|Write API Key %apiKey|Field1 %field1||Field2 %field2|Field3 %field3|Field4 %field4|Field5 %field5|Field6 %field6|Field7 %field7|Field8 %field8"
    //% block.loc.de="Schicke Daten zu deinem ThinkSpeak Kanal|Write API Key %apiKey|Field1 %field1||Field2 %field2|Field3 %field3|Field4 %field4|Field5 %field5|Field6 %field6|Field7 %field7|Field8 %field8"
    //% apiKey.defl="your Write API Key"
    //% weight=9
    export function sendToThinkSpeak(apiKey: string, field1: number, field2: number, field3: number, field4: number, field5: number, field6: number, field7: number, field8: number) {
        let result = 0
        let retry = 2

        // close the previous TCP connection
        if (isWifiConnected) {
            sendAtCmd("AT+CIPCLOSE")
            waitAtResponse("OK", "ERROR", "None", 2000)
        }

        while (isWifiConnected && retry > 0) {
            retry = retry - 1;
            // establish TCP connection
            sendAtCmd("AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",80")
            result = waitAtResponse("OK", "ALREADY CONNECTED", "ERROR", 2000)
            if (result == 3) continue

            let data = "GET /update?api_key=" + apiKey
            if (!isNaN(field1)) data = data + "&field1=" + field1
            if (!isNaN(field2)) data = data + "&field2=" + field2
            if (!isNaN(field3)) data = data + "&field3=" + field3
            if (!isNaN(field4)) data = data + "&field4=" + field4
            if (!isNaN(field5)) data = data + "&field5=" + field5
            if (!isNaN(field6)) data = data + "&field6=" + field6
            if (!isNaN(field7)) data = data + "&field7=" + field7
            if (!isNaN(field8)) data = data + "&field8=" + field8

            sendAtCmd("AT+CIPSEND=" + (data.length + 2))
            result = waitAtResponse(">", "OK", "ERROR", 2000)
            if (result == 3) continue
            sendAtCmd(data)
            result = waitAtResponse("SEND OK", "SEND FAIL", "ERROR", 5000)

            // // close the TCP connection
            // sendAtCmd("AT+CIPCLOSE")
            // waitAtResponse("OK", "ERROR", "None", 2000)

            if (result == 1) break
        }
    }



    function waitAtResponse(target1: string, target2: string, target3: string, timeout: number) {
        let buffer = ""
        let start = input.runningTime()

        while ((input.runningTime() - start) < timeout) {
            buffer += serial.readString()

            if (buffer.includes(target1)) return 1
            if (buffer.includes(target2)) return 2
            if (buffer.includes(target3)) return 3

            basic.pause(100)
        }

        return 0
    }

    function sendAtCmd(cmd: string) {
        serial.writeString(cmd + "\u000D\u000A")
    }
}