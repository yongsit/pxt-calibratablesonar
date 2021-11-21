enum PingUnit {
    //% block="μs"
    MicroSeconds,
    //% block="cm"
    Centimeters,
    //% block="inches"
    Inches
}

/**
 * Sonar and ping utilities
 */
//% color="#2c3e50" weight=10
namespace CalibratableSonar {


    let trigerPin = DigitalPin.P1;
    let echoPin = DigitalPin.P2;
    let minPuleTime = 0;
    let maxPuleTime = 0;

    //% blockId=cs_initSonar block="initialize SONAR trig %trig|echo %echo| Calibrate %calibrate"
    //% trig.defl=DigitalPin.P1
    //% echo.defl=DigitalPin.P2
    
    export function initSonar(trig: DigitalPin, echo: DigitalPin, calibrate: Boolean, minCmDistance = 2, maxCmDistance = 500){
        trigerPin = trig;
        echoPin = echo;


    }

    //% blockId=cs_ping block="pingSONAR"
    export function ping (maxduration?: number): number{
        // send pulse
        pins.setPull(trigerPin, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P1, 0);
        control.waitMicros(1000);
        pins.digitalWritePin(DigitalPin.P1, 1);
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P1, 0);

        // read pulse
        const d =  pins.pulseIn(DigitalPin.P2, PulseValue.High, maxduration);
        return d;
    }

    //% blockId=cs_getDistant block="get distant unit %unit"
    export function getDistant(unit: PingUnit): number{
        const d = ping();

        switch (unit) {
            case PingUnit.Centimeters: return Math.idiv(d, 58);
            case PingUnit.Inches: return Math.idiv(d, 148);
            default: return d;
        }
    }
    
    /**
         * Send a ping and get the echo time (in microseconds) as a result
         * @param trig tigger pin
         * @param echo echo pin
         * @param unit desired conversion unit
         * @param maxCmDistance maximum distance in centimeters (default is 500)
         */
    //% blockId=sonar_ping block="ping trig %trig|echo %echo|unit %unit"
    export function pingXXX(trig: DigitalPin, echo: DigitalPin, unit: PingUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

        switch (unit) {
            case PingUnit.Centimeters: return Math.idiv(d, 58);
            case PingUnit.Inches: return Math.idiv(d, 148);
            default: return d;
        }
    }
  
}