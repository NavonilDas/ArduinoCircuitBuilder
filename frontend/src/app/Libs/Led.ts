import { Point } from './Point';
import { CircuitElement } from './CircuitElement';

declare var window;

export class Led extends CircuitElement{
    id: number;
    points: any[][] = [[0, 85], [0, 50], [50, 85]];
    tags: string[] = ["M", "L", "a25,25 180 0,1 50,0 L"];
    color: string = "#f00";
    body: any;
    leg_plus: any;
    leg_neg: any;
    leg_p: Point;
    leg_n: Point;

    tmpx: number;
    tmpy: number;
    gloWElement: any;

    constructor(private canvas: any, public x: number, public y: number) {
        super("Led");
        this.id = window.scope["Led"].length;
        this.tmpx = this.x;
        this.tmpy = this.y;

        let tmp = "";
        for (let i = 0; i < this.tags.length; ++i) {
            tmp += this.tags[i] + (this.x + this.points[i][0]) + "," + (this.y + this.points[i][1]) + " ";
        }
        tmp += "Z";
        this.body = this.canvas.path(tmp);
        this.body.attr({ fill: this.color });
        this.leg_plus = this.canvas.path(`M${this.x + 14},${this.y + 85} L${this.x + 14},${this.y + 140}Z`);
        this.leg_neg = this.canvas.path(`M${this.x + 36},${this.y + 85} L${this.x + 36},${this.y + 140}Z`);

        this.leg_p = new Point(this.canvas, this.x + 12, this.y + 138, "POSITIVE", this);
        this.leg_n = new Point(this.canvas, this.x + 34, this.y + 138, "NEGATIVE", this);


        this.body.click(() => {
            window["isSelected"] = true;
            window["Selected"] = this;
        });

        this.body.drag((dx, dy) => {
            let tmp = "";
            for (let i = 0; i < this.tags.length; ++i) {
                tmp += this.tags[i] + (this.x + dx + this.points[i][0]) + "," + (this.y + dy + this.points[i][1]) + " ";
            }
            tmp += "Z";
            this.body.animate({ path: tmp }, 1);

            this.leg_plus.animate({ path: `M${this.x + dx + 14},${this.y + dy + 85} L${this.x + dx + 14},${this.y + dy + 140}Z` }, 1);
            this.leg_p.move(this.x + dx + 12, this.y + dy + 138);
            this.leg_neg.animate({ path: `M${this.x + dx + 36},${this.y + dy + 85} L${this.x + dx + 36},${this.y + dy + 140}Z` }, 1);
            this.leg_n.move(this.x + dx + 34, this.y + dy + 138);

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
    setColor(color: string) {
        this.color = color;
        this.body.attr({ fill: this.color });
    }
    remove() {
        this.leg_p.remove();
        this.leg_n.remove();
        this.leg_plus.remove();
        this.body.remove();
        this.leg_neg.remove();
        if (this.gloWElement)
            this.gloWElement.remove();
    }
    save() {
        return {
            x: this.x,
            y: this.y,
            id: this.id
        };
    }
    load(data: any) {
        this.id = data.id;
    }
    // returns node pointer on basis of x,y position
    getNode(point: number[]) {
        if (this.leg_p.x == point[0] - 2 && this.leg_p.y == point[1] - 2)
            return this.leg_p;
        if (this.leg_n.x == point[0] - 2 && this.leg_n.y == point[1] - 2)
            return this.leg_n;
        return null
    }
}
window["Led"] = Led;