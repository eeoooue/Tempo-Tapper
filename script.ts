class TempoTracker {
    private timestamps = [0, 0, 0, 0, 0, 0, 0, 0];
    private i: number = 0;
    private readonly msPerMin: number = 60_000;

    public addTimeStamp(): void {
        const currentTime: number = new Date().getTime();
        const previousTime: number = this.timestamps[this.i];
        const difference: number = currentTime - previousTime;

        if (difference > 100) {
            this.i = (this.i + 1) % this.timestamps.length;
            this.timestamps[this.i] = currentTime;
        }
    }

    private reasonableTimeDifference(timeDiff: number, previousInterval: number | undefined): boolean {

        if (previousInterval) {
            var percentage: number = 100 * timeDiff / previousInterval;
            var percentageDifference: number = Math.abs(percentage - 100);

            if (percentageDifference > 30) {
                return false;
            }
        }

        return (200 <= timeDiff && timeDiff <= 2000);
    }

    private getAverageDifference(): number {

        let count = 0;
        let total = 0;

        const n: number = this.timestamps.length;
        let i = (this.i - 1 + n) % n;
        let j = this.i;

        var previousInterval: number | undefined;

        for (let r = 0; r < 8; r++) {
            const a: number = this.timestamps[i];
            const b: number = this.timestamps[j];

            if (a && b) {
                const timeDiff: number = b - a;

                if (this.reasonableTimeDifference(timeDiff, previousInterval)) {
                    count += 1;
                    total += timeDiff;
                    previousInterval = timeDiff;
                }
            }

            i = (n + i - 1) % n;
            j = (n + j - 1) % n;
        }

        if (count < 1) {
            return 0;
        }

        return total / count;
    }

    public getTempoEstimate(): string {
        const averageDifference = this.getAverageDifference();

        if (averageDifference === 0) {
            return "Tap!";
        }

        const beatsPerMinute: number = this.msPerMin / averageDifference;
        const estimate: number = Math.round(beatsPerMinute);
        return estimate.toString();
    }
}


class TempoPad {

    private tracker: TempoTracker = new TempoTracker();

    constructor(element: HTMLElement) {

        element.addEventListener("click", () => {
            console.log("hello world");
            this.SubmitNewTime();
        })
    }

    private SubmitNewTime() {

        this.tracker.addTimeStamp();
        const estimate: string = this.tracker.getTempoEstimate();
        this.UpdateText(estimate);
    }

    private UpdateText(estimate: string) {

        const bpmText: HTMLElement | null = document.querySelector(".bpm-text");
        if (bpmText) {
            bpmText.innerHTML = `${estimate}`;
        }
    }
}


const bpmPad: HTMLElement | null = document.querySelector(".bpm-pad");

if (bpmPad) {
    new TempoPad(bpmPad);
}

