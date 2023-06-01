var TempoTracker = /** @class */ (function () {
    function TempoTracker() {
        this.timestamps = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];
        this.i = 0;
        this.msPerMin = 60000;
    }
    TempoTracker.prototype.addTimeStamp = function () {
        var d = new Date();
        var prev = this.timestamps[this.i];
        var difference = d.getTime() - prev.getTime();
        if (difference > 50) {
            this.i = (this.i + 1) % this.timestamps.length;
            this.timestamps[this.i] = d;
            return true;
        }
        return false;
    };
    TempoTracker.prototype.reasonableTimeDifference = function (timeDiff) {
        if (100 < timeDiff && timeDiff < 3000) {
            return true;
        }
        return false;
    };
    TempoTracker.prototype.getAverageDifference = function () {
        var count = 0;
        var total = 0;
        var i = (this.i - 1 + this.timestamps.length) % this.timestamps.length;
        var j = this.i;
        for (var r = 0; r < 8; r++) {
            var a = this.timestamps[i];
            var b = this.timestamps[j];
            if (a && b) {
                var timeDiff = b.getTime() - a.getTime();
                if (this.reasonableTimeDifference(timeDiff)) {
                    count += 1;
                    total += timeDiff;
                }
                else {
                    break;
                }
            }
            i = (i - 1 + this.timestamps.length) % this.timestamps.length;
            j = (j - 1 + this.timestamps.length) % this.timestamps.length;
        }
        if (count < 2) {
            return 0;
        }
        var averageDifference = total / count;
        return averageDifference;
    };
    TempoTracker.prototype.getTempoEstimate = function () {
        var averageDifference = this.getAverageDifference();
        if (averageDifference === 0) {
            return "--";
        }
        var beatsPerMinute = this.msPerMin / averageDifference;
        var estimate = Math.round(beatsPerMinute);
        return estimate.toString();
    };
    return TempoTracker;
}());
var TempoPad = /** @class */ (function () {
    function TempoPad(element) {
        var _this = this;
        this.tracker = new TempoTracker();
        element.addEventListener("click", function () {
            console.log("hello world");
            _this.SubmitNewTime();
        });
    }
    TempoPad.prototype.SubmitNewTime = function () {
        if (this.tracker.addTimeStamp()) {
            // this.PlaySound();
            var estimate = this.tracker.getTempoEstimate();
            this.UpdateText(estimate);
        }
        this.PlaySound();
    };
    TempoPad.prototype.PlaySound = function () {
        var element = document.getElementById("tap-low");
        if (element instanceof HTMLAudioElement) {
            element.pause();
            element.play();
        }
    };
    TempoPad.prototype.UpdateText = function (estimate) {
        var bpmText = document.querySelector(".bpm-text");
        if (bpmText) {
            bpmText.innerHTML = "".concat(estimate);
        }
    };
    return TempoPad;
}());
var bpmPad = document.querySelector(".bpm-pad");
if (bpmPad) {
    new TempoPad(bpmPad);
}
