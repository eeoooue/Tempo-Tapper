var bpmPad = document.querySelector(".bpm-pad");
var bpmText = document.querySelector(".bpm-text");
var timestamps = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];
var position = 0;
function SubmitNewTime() {
    var d = new Date();
    var prev = timestamps[position];
    var difference = d.getTime() - prev.getTime();
    console.log("comparing ".concat(d.getTime(), " and ").concat(prev.getTime()));
    if (difference < 2000) {
        var estimate = takeAverageBPM();
        if (bpmText) {
            bpmText.innerHTML = "".concat(estimate);
        }
    }
    position = (position + 1) % 8;
    timestamps[position] = d;
}
function takeAverageBPM() {
    var start = (position + 9) % 8;
    var count = 0;
    var total = 0;
    for (var i = start; i < start + 7; i++) {
        var a = timestamps[i % 8];
        var b = timestamps[(i + 1) % 8];
        var timeDiff = b.getTime() - a.getTime();
        if (100 < timeDiff && timeDiff < 3000) {
            count += 1;
            total += timeDiff;
        }
    }
    if (count < 2) {
        return "--";
    }
    var averageDifference = total / count;
    var millisecondsPerMinute = 60000;
    console.log("dividing ".concat(millisecondsPerMinute, " by ").concat(averageDifference));
    return Math.round(millisecondsPerMinute / averageDifference);
}
if (bpmPad) {
    bpmPad.addEventListener("click", function () {
        console.log("hello world");
        SubmitNewTime();
    });
}
