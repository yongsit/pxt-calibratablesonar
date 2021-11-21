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

    function ping (maxduration?: number): number{
        // send pulse
        pins.setPull(trigerPin, PinPullMode.PullNone);
        pins.digitalWritePin(trigerPin, 0);
        control.waitMicros(1000);
        pins.digitalWritePin(trigerPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigerPin, 0);

        // read pulse
        return pins.pulseIn(echoPin, PulseValue.High, maxduration);
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

  
}