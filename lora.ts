/*
* pxt-iot-lora node, Micro:Bit library for IoTLoRaNode
* Copyright (C) 2018-2020  Pi Supply
* Changes for Calliope mini 8.5.2020 M. Klein
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
* Last Updated 2020-02-13-1520
*/

enum Channels {
    //% block="One"    
    One = 1,
    //% block="Two"
    Two = 2,
    //% block="Three"
    Three = 3,
    //% block="Four"
    Four = 4,
    //% block="Five"
    Five = 5,
    //% block="Six"
    Six = 6,
    //% block="Seven"
    Seven = 7,
    //% block="Eight"
    Eight = 8,
    //% block="Nine"
    Nine = 9,
    //% block="Ten"
    Ten = 10,
    //% block="Eleven"
    Eleven = 11,
    //% block="Twelve"
    Twelve = 12,
    //% block="Thirteen"
    Thirteen = 13,
    //% block="Fourteen"
    Fourteen = 14,
    //% block="fifteen"
    Fifteen = 15,
    //% block="Sixteen"
    Sixteen = 16,
    //% block="Seventeen"
    Seventeen = 17,
    //% block="Eighteen"
    Eighteen = 18,
    //% block="Nineteen"
    Nineteen = 19,
    //% block="Twenty"
    Twenty = 20

}

enum GPIOPins {
    //% block="PA15"
    PA15 = 14,
    //% block="PB3"
    PB3 = 15,
    //% block="PB5"
    PB5 = 16,
    //% block="PB8"
    PB8 = 18,
    //% block="PB9"
    PB9 = 19,
    //% block="PA2"
    PA2 = 20

}

enum ADCPins {
    //% block="PA2"
    PA2 = 20

}



//% weight=8 color=#9F79EE icon="\uf1b3" block="IoT-LoRa"
namespace IotLoRaNode {
    serial.redirect(SerialPin.C17, SerialPin.C16, BaudRate.BaudRate9600); // C16/C17
    let payload = ""

    //% blockId="IotLoRaNode_InitializeRadioOTAA" block="Initialize LoRa Radio via OTAA:|Device Eui %deveui|App Key %appkey"
    //% blockGap=8
    //% weight=60
    export function InitializeRadioOTAA(deveui: string, appkey: string): void {

        basic.pause(75)
        //Set to use LoRaWAN Mode 
        serial.writeString("AT+MODE=LWOTAA\r\n");
        serial.readLine()

        basic.pause(75)
        //Set to use LoRaWAN Mode
        serial.writeString("AT+DR=EU868\r\n");
        serial.readLine()

        basic.pause(75)
        //Set to use LoRaWAN Mode
        serial.writeString("AT+CH=NUM,0-2\r\n");
        serial.readLine()

        basic.pause(75)
        //Set the application session key
        serial.writeString("AT+KEY=APPKEY," + appkey + "\r\n");
        serial.readLine()

        basic.pause(75)
        //Set the device extended unique identifier
        serial.writeString("AT+ID=DEVEUI," + deveui + "\r\n");
        serial.readLine()

        basic.pause(75)
        //Set the application session key
        serial.writeString("AT+CLASS=C\r\n");
        serial.readLine()

        basic.pause(75)
        //Set the application session key
        serial.writeString("AT+PORT=8\r\n");
        serial.readLine()

        basic.pause(75)
        //"Join" the LoRaWAN Network in ABP Mode
        serial.writeString("AT+JOIN\r\n");
        serial.readLine()

        //Display on the screen that LoRa is ready.
        basic.showString("LoRa Ready")


    }



    //% blockId="IotLoRaNode_DigitalValue"
    //% block="Add Digital Value: %value on channel: %chanNum"
    export function DigitalValue(value: boolean, chanNum: Channels): void {
        /**
         * Add digital value
         */
        let intVal = value ? 1 : 0;
        payload = payload + "0" + chanNum + "000" + intVal;

    }
    //% blockId="IotLoRaNode_AnalogueValue" block="Add Analogue Value: %value on channel: %chanNum"
    //% value.min=0 value.max=254
    export function AnalogueValue(value: number, chanNum: Channels): void {
        /**
         * Add analogue value
         */
        let bufr = pins.createBuffer(2);
        bufr.setNumber(NumberFormat.Int16BE, 0, (value * 100))

        payload = payload + "0" + chanNum + "02" + bufr.toHex();


    }

    //% blockId="IotLoRaNode_temperatureValue" block="Add Temperature Value: %temperatureVal to channel: %chanNum"
    export function TemperatureValue(temperatureVal: number, chanNum: Channels): void {
        /**
         * Add temperature value
         */
        let bufr = pins.createBuffer(2);
        bufr.setNumber(NumberFormat.Int16BE, 0, (temperatureVal * 10))

        payload = payload + "0" + chanNum + "67" + bufr.toHex();


    }

    //% blockId="IotLoRaNode_barometerValue" block="Add Barometer Value: %barometerVal to channel: %chanNum"
    export function BarometerValue(barometerVal: number, chanNum: Channels): void {
        /**
         * Add barometer value
         */
        let bufr = pins.createBuffer(2);
        bufr.setNumber(NumberFormat.Int16BE, 0, (barometerVal * 10))

        payload = payload + "0" + chanNum + "73" + bufr.toHex();


    }

    //% blockId="IotLoRaNode_PresenceSensor"
    //% block="Add Presence Sensor: %value on channel: %chanNum"
    export function PresenceSensor(value: boolean, chanNum: Channels): void {
        /**
         * Add presence value
         */
        let intVal = value ? 1 : 0;
        payload = payload + "0" + chanNum + "660" + intVal;

    }

    //% blockId="IotLoRaNode_HumidityValue" block="Add Humidity Value: %humidityVal to channel: %chanNum"
    export function HumidityValue(humidityVal: number, chanNum: Channels): void {
        /**
         * Add humidity value
         */
        let bufr = pins.createBuffer(1);
        bufr.setNumber(NumberFormat.UInt8BE, 0, (humidityVal * 2))

        payload = payload + "0" + chanNum + "68" + bufr.toHex();


    }

    //% blockId="IotLoRaNode_AccelorometerValue" block="Add Accelerometer Values |X %accelValX|Y %accelVal|Z %accelValZ to channel %chanNum"
    export function AccelorometerValue(accelValX: number, accelValY: number, accelValZ: number, chanNum: Channels): void {
        /**
         * Add accelorometer
         */
        let bufr = pins.createBuffer(6);
        bufr.setNumber(NumberFormat.Int16BE, 0, (accelValX * 100))
        bufr.setNumber(NumberFormat.Int16BE, 2, (accelValY * 100))
        bufr.setNumber(NumberFormat.Int16BE, 4, (accelValZ * 100))

        payload = payload + "0" + chanNum + "71" + bufr.toHex();

    }


    //% blockId="IotLoRaNode_LightValue" block="Add light Value: %lightVal on channel: %chanNum"
    export function LightValue(lightVal: number, chanNum: Channels): void {
        /**
         * Add light value
         */
        let bufr = pins.createBuffer(2);
        bufr.setNumber(NumberFormat.Int16BE, 0, (lightVal))

        payload = payload + "0" + chanNum + "65" + bufr.toHex();

    }



    //% blockId="IotLoRaNode_GPS" block="Add GPS Value - Latitude: %latitude Longitude %longitude Altitude %altitude on channel: %chanNum"
    //% blockGap=8
    export function GPS(latitude: number, longitude: number, altitude: number, chanNum: Channels): void {
        /**
         * Add GPS value
         */
        let latBuf = pins.createBuffer(4);
        latBuf.setNumber(NumberFormat.Int32BE, 0, longitude * 10000)
        let latBuf2 = latBuf.slice(1, 4);

        let lonBuf = pins.createBuffer(4);
        lonBuf.setNumber(NumberFormat.Int32BE, 0, latitude * 10000)
        let lonBuf2 = lonBuf.slice(1, 4);
        let altBuf = pins.createBuffer(4);
        altBuf.setNumber(NumberFormat.Int32BE, 0, altitude * 100)
        let altBuf2 = altBuf.slice(1, 4);
        payload = "" + payload + "0" + chanNum + "88" + lonBuf2.toHex() + latBuf2.toHex() + altBuf2.toHex()




    }

    //% blockId="IotLoRaNode_TransmitMessage" block="Transmit LoRa Data"
    //% weight=50
    export function loraTransmitPayload(): void {
        /**
         * Transmit Message
         */

        serial.writeString("AT+CMSGHEX=" + payload + "\r\n");
        serial.readUntil(serial.delimiters(Delimiters.NewLine))
        basic.pause(100)
        payload = ""
    }


}