
class TempoPad{

    private buttonElement: HTMLElement;
    private timestamps = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];
    private i: number = 0;

    constructor(element: HTMLElement){

        this.buttonElement = element;

        element.addEventListener("click", () => {
            console.log("hello world");
            this.SubmitNewTime();
        })
    }

    private SubmitNewTime(){

        const d = new Date();
        var prev: Date = this.timestamps[this.i];
    
        const difference: number = d.getTime() - prev.getTime()
    
        console.log(`comparing ${d.getTime()} and ${prev.getTime()}`)
    
        if (difference < 2000){
            const estimate = this.takeAverageBPM();
            this.UpdateText(estimate);
        }
    
        this.i = (this.i + 1) % this.timestamps.length;
        this.timestamps[this.i] = d;
    }

    private UpdateText(estimate: string){

        const bpmText: HTMLElement | null = document.querySelector(".bpm-text");
        if (bpmText){
            bpmText.innerHTML = `${estimate}`;
        }
    }

    
    private takeAverageBPM(): string {

        var start = (this.i + 9) % 8;

        var count = 0;
        var total = 0;

        for(var i = start; i < start+7; i++){
            var a : Date = this.timestamps[i % 8];
            var b : Date = this.timestamps[(i + 1) % 8];

            var timeDiff : number = b.getTime() - a.getTime();

            if (100 < timeDiff && timeDiff < 3000){
                count += 1;
                total += timeDiff;
            }
        }

        if (count < 2){
            return "--"
        }

        var averageDifference = total / count;

        const millisecondsPerMinute = 60000;
        console.log(`dividing ${millisecondsPerMinute} by ${averageDifference}`)
        return Math.round(millisecondsPerMinute/averageDifference).toString();
    }
}


const bpmPad: HTMLElement | null = document.querySelector(".bpm-pad");

if (bpmPad){
    new TempoPad(bpmPad);
}

