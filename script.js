var TempoPad = /** @class */ (function () {
    function TempoPad(element) {
        var _this = this;
        this.timestamps = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];
        this.i = 0;
        this.buttonElement = element;
        element.addEventListener("click", function () {
            console.log("hello world");
            _this.SubmitNewTime();
        });
    }
    TempoPad.prototype.SubmitNewTime = function () {
        var d = new Date();
        var prev = this.timestamps[this.i];
        var difference = d.getTime() - prev.getTime();
        console.log("comparing ".concat(d.getTime(), " and ").concat(prev.getTime()));
        if (difference < 2000) {
            var estimate = this.takeAverageBPM();
            this.UpdateText(estimate);
        }
        this.i = (this.i + 1) % this.timestamps.length;
        this.timestamps[this.i] = d;
    };
    TempoPad.prototype.UpdateText = function (estimate) {
        var bpmText = document.querySelector(".bpm-text");
        if (bpmText) {
            bpmText.innerHTML = "".concat(estimate);
        }
    };
    TempoPad.prototype.takeAverageBPM = function () {
        var start = (this.i + 9) % 8;
        var count = 0;
        var total = 0;
        for (var i = start; i < start + 7; i++) {
            var a = this.timestamps[i % 8];
            var b = this.timestamps[(i + 1) % 8];
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
        return Math.round(millisecondsPerMinute / averageDifference).toString();
    };
    return TempoPad;
}());
var bpmPad = document.querySelector(".bpm-pad");
if (bpmPad) {
    new TempoPad(bpmPad);
}
