
const bpmPad: HTMLElement | null = document.querySelector(".bpm-pad");
const bpmText: HTMLElement | null = document.querySelector(".bpm-text");

const timestamps = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];
var position = 0;


function SubmitNewTime()
{
    const d = new Date();
    var prev: Date = timestamps[position];

    const difference: number = d.getTime() - prev.getTime()

    console.log(`comparing ${d.getTime()} and ${prev.getTime()}`)

    if (difference < 2000){
        const estimate = takeAverageBPM();
        if (bpmText){
            bpmText.innerHTML = `${estimate}`;
        }
    }

    position = (position + 1) % 8;
    timestamps[position] = d;
}


function takeAverageBPM(){

    var start = (position + 9) % 8;

    var count = 0;
    var total = 0;

    for(var i = start; i < start+7; i++){
        var a : Date = timestamps[i % 8];
        var b : Date = timestamps[(i + 1) % 8];

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
    return Math.round(millisecondsPerMinute/averageDifference);
}

if (bpmPad){
    bpmPad.addEventListener("click", () => {
        console.log("hello world");
        SubmitNewTime();
    })
}

