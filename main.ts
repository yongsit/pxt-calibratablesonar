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

    const minimumDistantCM: number = 2;
    const maximumDistantCM: number = 500;

    let trigerPin: DigitalPin = DigitalPin.P1;
    let echoPin: DigitalPin = DigitalPin.P2;
    let cmPulseTime: number = 58;
    let minPuleTime: number = minimumDistantCM * cmPulseTime;
    let maxPuleTime: number = maximumDistantCM * cmPulseTime;
    let standardDiviationCM: number = 10;

    //% blockId=cs_initSonar block="initialize SONAR trig %trig|echo %echo| calibrate distant %calDist"
    //% trig.defl=DigitalPin.P1
    //% echo.defl=DigitalPin.P2
    //% calibrateDist.defl=0
    //% group="Initializing"
    export function initSonar(trig: DigitalPin, echo: DigitalPin, calDist: number){
        trigerPin = trig;
        echoPin = echo;

        if (calDist > 0) {
            calibrateSonar(calDist);
        }

        minPuleTime = minimumDistantCM * cmPulseTime;
        maxPuleTime = maximumDistantCM * cmPulseTime;
    }

    function calibrateSonar(calDist: number, minCmDistance: number = 2, maxCmDistance: number = 500)
    {
        const calibrateSlot = 100;
        let i: number = 0;
        let times = [];
        let avg: number = 0;
        let sdAvg = 0;

        // Get data from SONAR multiple times on constant distant.
        for (i = 0; i < calibrateSlot; i++ )
        {
            let time = ping();
            times.push(time);
            avg += (time - avg) / (i + 1);
        }

        // Update pluse time per CM.
        avg = Math.floor(avg);
        cmPulseTime = Math.floor(avg / calDist);
        basic.showNumber(cmPulseTime);

        // Calulate standard diviation 
        for (i = 0; i < calibrateSlot; i++) {
            sdAvg += (Math.pow((times[i] - avg), 2) - sdAvg) / (i + 1);
        }
        sdAvg = Math.floor(Math.sqrt(sdAvg)) ;
        standardDiviationCM = sdAvg / cmPulseTime;

        basic.showNumber(standardDiviationCM);
    }


 
    function ping (): number{
        // send pulse
        pins.setPull(trigerPin, PinPullMode.PullNone);
        pins.digitalWritePin(trigerPin, 0);
        control.waitMicros(1000);
        pins.digitalWritePin(trigerPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigerPin, 0);

        // read pulse
        return pins.pulseIn(echoPin, PulseValue.High, maxPuleTime);
    }

    //% blockId=cs_getDistant block="get distant unit %unit"
    //% group="Reading"
    export function getDistant(unit: PingUnit): number{
        const d = ping();

        switch (unit) {
            case PingUnit.Centimeters: return Math.idiv(d, 58);
            case PingUnit.Inches: return Math.idiv(d, 148);
            default: return d;
        }
    }
    
   
  
}