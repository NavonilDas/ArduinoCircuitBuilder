import { Point } from './Point';

declare var window;

export class Buzzer {
    leg_plus: any;
    leg_neg: any;
    leg_p: Point;
    leg_n: Point;
    outer: any;
    inner: any;
    tmpx: number;
    tmpy: number;
    id: number;
    keyName: string = "Buzzer";

    constructor(private canvas: any, public x: number, public y: number) {
        this.id = window.scope["Buzzer"].length;

        this.tmpx = x;
        this.tmpy = y;

        this.leg_plus = this.canvas.path(`M${this.x - 15},${this.y + 20} L${this.x - 15},${this.y + 50}Z`);
        this.leg_neg = this.canvas.path(`M${this.x + 15},${this.y + 20} L${this.x + 15},${this.y + 50}Z`);

        this.outer = this.canvas.circle(x, y, 30);
        this.outer.attr({ fill: "#383838", stroke: "#383838" });

        this.inner = this.canvas.circle(x, y, 5);
        this.inner.attr({ fill: "#b07425", stroke: "#b07425" });

        this.leg_p = new Point(canvas, x - 17, y + 48, "POSITIVE", this);
        this.leg_n = new Point(canvas, x + 13, y + 48, "NEGATIVE", this);

        this.outer.drag((dx, dy) => {
            this.outer.attr({ cx: this.x + dx, cy: this.y + dy });
            this.inner.attr({ cx: this.x + dx, cy: this.y + dy });

            this.leg_plus.animate({ path: `M${this.x + dx - 15},${this.y + dy + 20} L${this.x + dx - 15},${this.y + dy + 50}Z` }, 1);
            this.leg_neg.animate({ path: `M${this.x + dx + 15},${this.y + dy + 20} L${this.x + dx + 15},${this.y + dy + 50}Z` }, 1);

            this.leg_p.move(this.x + dx - 17, this.y + dy + 48);
            this.leg_n.move(this.x + dx + 13, this.y + dy + 48);

            this.tmpx = this.x + dx;
            this.tmpy = this.y + dy;
        }, () => {
            this.x = this.tmpx;
            this.y = this.tmpy;
        }, () => {
            this.x = this.tmpx;
            this.y = this.tmpy;
        });
    }
    save() {
        return {
            x: this.x,
            y: this.y,
            id: this.id
        };
    }
    load(data:any) {
        this.x = data.x;
        this.y = data.y;
        this.id = data.id;
    }
    // returns node pointer on basis of x,y position
    getNode(x: number, y: number) {

    }
    // TODO: Play Music on Simulation
}
window["Buzzer"] = Buzzer;