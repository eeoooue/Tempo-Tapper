
var position = 0;
const timings = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];


function SubmitNewTime()
{
    const d = new Date();
    prev = timings[position];

    difference = d.getTime() - prev.getTime()
    console.log(`comparing ${d.getTime()} and ${prev.getTime()}`)

    if (difference < 2000){
        const estimate = takeAverageBPM(difference);
        btnText.innerText = `${estimate}`;
    }

    position = (position + 1) % 8;
    timings[position] = d;
}

function takeAverageBPM(difference){

    var start = (position + 9) % 8;

    var count = 0;
    var total = 0;

    for(var i = start; i < start+7; i++){
        a = timings[i % 8];
        b = timings[(i + 1) % 8];

        difference = b - a;

        if (100 < difference && difference < 3000){
            count += 1;
            total += difference;
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


const btnPad = document.querySelector(".bpm-pad");
const btnText = document.querySelector(".bpm-text");

btnPad.addEventListener("click", () => {
    SubmitNewTime();
})


