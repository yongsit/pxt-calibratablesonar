/**
 * Sonar and ping utilities
 */


//% color="#ff0000" icon="\uf0a4"
namespace CalibratableSonar {

    const minimumDistantCM: number = 2;
    const maximumDistantCM: number = 500;

    let trigerPin: DigitalPin = DigitalPin.P1;
    let echoPin: DigitalPin = DigitalPin.P2;
    let cmPulseTime: number = 58;
    let minPuleTime: number = minimumDistantCM * cmPulseTime;
    let maxPuleTime: number = maximumDistantCM * cmPulseTime;
    let standardDiviationCM: number = 10;
    let estimatedDistantCM: number = 0;
    let rawDistantCM: number = 0;

    //% blockId=cs_initSonar block="initialize SONAR trig %trig|echo %echo| calibrate distant %calDist"
    //% trig.defl=DigitalPin.P1
    //% echo.defl=DigitalPin.P2
    //% calDist.defl=0
    //% group="Initializing"
    export function initSonar(trig: DigitalPin, echo: DigitalPin, calDist: number){
        trigerPin = trig;
        echoPin = echo;

        if (calDist > 0) {
            calibrateSonar(calDist);
        }

        basic.showNumber(cmPulseTime);
        basic.showNumber(standardDiviationCM);

        minPuleTime = minimumDistantCM * cmPulseTime;
        maxPuleTime = maximumDistantCM * cmPulseTime;
    }

    function calibrateSonar(calDist: number)
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
            led.plotBarGraph( i+1, 100);
        }

        // Update pluse time per CM.
        avg = Math.floor(avg);
        cmPulseTime = avg / calDist;
        
        // Calulate standard diviation 
        for (i = 0; i < calibrateSlot; i++) {
            sdAvg += (Math.pow((times[i] - avg), 2) - sdAvg) / (i + 1);
        }
        sdAvg = Math.sqrt(sdAvg);
        standardDiviationCM = sdAvg / cmPulseTime;
    }

    //% blockId=cs_getTime block="get time (??s)"
    //% group="Reading"
    export function ping (): number{
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

    //% blockId=cs_getDistant block="get distant gain %gain"
    //% gain.defl=20 gain.min=1 gain.max=100
    //% group="Reading"
    export function getDistant(gain: number): number{
        let time: number = ping();
        let distant: number = 0;

        if (time < minPuleTime || time > maxPuleTime) {
            distant = estimatedDistantCM;
        }
        else
        {
            distant = Math.idiv(time, cmPulseTime);
            estimatedDistantCM = ((100 - gain) * estimatedDistantCM / 100) + (gain * distant / 100);
        }

        rawDistantCM = distant;
        return estimatedDistantCM;
    }
    
   
    //% blockId=cs_getRawDistant block="get raw distant"
    //% group="Reading"
    export function getRawDistant(): number {
        return rawDistantCM;
    }

}