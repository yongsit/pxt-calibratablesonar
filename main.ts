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

    //% blockId=cs_initSonar block="initialize SONAR trig %trig|echo %echo|unit %unit| Calibrate %calibrate"
    export function initSonar(trig: DigitalPin, echo: DigitalPin, unit: PingUnit, calibrate: Boolean, minCmDistance = 2, maxCmDistance = 500){
        trigerPin = trig;
        echoPin = echo;


    }

    function ping (maxduration?: number): number{
        // send pulse
        pins.setPull(trigerPin, PinPullMode.PullNone);
        pins.digitalWritePin(trigerPin, 0);
        control.waitMicros(50);
        pins.digitalWritePin(trigerPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigerPin, 0);

        // read pulse
        return pins.pulseIn(echoPin, PulseValue.High, maxduration);
    }

    //% blockId=cs_getDistant block="get distant"
    export function getDistant (): number{
        return ping();
    }

    /**
     * Send a ping and get the echo time (in microseconds) as a result
     * @param trig tigger pin
     * @param echo echo pin
     * @param unit desired conversion unit
     * @param maxCmDistance maximum distance in centimeters (default is 500)
     */
    //% blockId=sonar_ping block="ping trig %trig|echo %echo|unit %unit"
    export function ping2(trig: DigitalPin, echo: DigitalPin, unit: PingUnit, maxCmDistance = 500): number {
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