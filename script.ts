class TempoTracker {
    private timestamps = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];
    private i: number = 0;
    private readonly msPerMin: number = 60_000;

    public addTimeStamp(): boolean {
        const d: Date = new Date();
        const prev: Date = this.timestamps[this.i];
        const difference: number = d.getTime() - prev.getTime();

        if (difference > 50) {
            this.i = (this.i + 1) % this.timestamps.length;
            this.timestamps[this.i] = d;
            return true;
        }

        return false;
    }


    private reasonableTimeDifference(timeDiff: number): boolean {

        if (100 < timeDiff && timeDiff < 3000) {
            return true;
        }

        return false;
    }

    private getAverageDifference(): number {
        let count = 0;
        let total = 0;

        let i = (this.i - 1 + this.timestamps.length) % this.timestamps.length;
        let j = this.i;

        for (let r = 0; r < 8; r++) {
            const a: Date | undefined = this.timestamps[i];
            const b: Date | undefined = this.timestamps[j];

            if (a && b) {
                const timeDiff: number = b.getTime() - a.getTime();
                if (this.reasonableTimeDifference(timeDiff)) {
                    count += 1;
                    total += timeDiff;
                } else {
                    break;
                }
            }

            i = (i - 1 + this.timestamps.length) % this.timestamps.length;
            j = (j - 1 + this.timestamps.length) % this.timestamps.length;
        }

        if (count < 2) {
            return 0;
        }

        const averageDifference = total / count;
        return averageDifference;
    }

    public getTempoEstimate(): string {
        const averageDifference = this.getAverageDifference();

        if (averageDifference === 0) {
            return "--";
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

        if (this.tracker.addTimeStamp()) {
            // this.PlaySound();
            const estimate: string = this.tracker.getTempoEstimate();
            this.UpdateText(estimate);
        }

        this.PlaySound();
    }

    private PlaySound() {

        const element: HTMLElement | null = document.getElementById("tap-low");

        if (element instanceof HTMLAudioElement) {
            element.pause();
            element.play();
        }
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

