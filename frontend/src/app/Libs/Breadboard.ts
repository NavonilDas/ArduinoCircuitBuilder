import { Point } from './Point';
import { CircuitElement } from './CircuitElement';

declare var window;

export class Breadboard extends CircuitElement {
    elements: any[] = [];
    points: Point[] = [];
    ////// 315
    constructor(private canvas: any, public x: number, public y: number) {
        super("Breadboard");

        this.elements = [
            this.canvas.rect(x, y, 330, 220),
            this.canvas.path(`M${this.x + 10},${this.y + 8} L${this.x + 320},${this.y + 8}Z`),
            this.canvas.path(`M${this.x + 10},${this.y + 32} L${this.x + 320},${this.y + 32}Z`),
            this.canvas.path(`M${this.x + 10},${this.y + 212} L${this.x + 320},${this.y + 212}Z`),
            this.canvas.path(`M${this.x + 10},${this.y + 188} L${this.x + 320},${this.y + 188}Z`),
        ];
        this.elements[0].attr({ 'fill': "#ffffff" });
        this.elements[0].click(() => this.click());
        this.elements[1].attr({ "stroke": "#00f" });
        this.elements[3].attr({ "stroke": "#00f" });
        this.elements[2].attr({ "stroke": "#f00" });
        this.elements[4].attr({ "stroke": "#f00" });
        for (let j = 1; j <= 5; ++j)
            for (let i = 1; i <= 5; ++i) {
                let tmpx = x + 10 + (i - 1) * 10 + (j - 1) * 62;
                this.elements.push(this.canvas.rect(tmpx, y + 12, 5, 5));
                this.elements.push(this.canvas.rect(tmpx, y + 22, 5, 5));
                this.elements.push(this.canvas.rect(tmpx, y + 192, 5, 5));
                this.elements.push(this.canvas.rect(tmpx, y + 202, 5, 5));
                this.points.push(new Point(canvas, tmpx, y + 12, "-", this));
                this.points.push(new Point(canvas, tmpx, y + 22, "+", this));
                this.points.push(new Point(canvas, tmpx, y + 192, "+", this));
                this.points.push(new Point(canvas, tmpx, y + 202, "-", this));
            }
        for (let j = 0; j < 5; ++j)
            for (let i = 1; i <= 30; ++i) {
                let tmpx = x + 10 + (i - 1) * 10,
                    tmpy = y + 45 + j * 10;
                this.elements.push(this.canvas.rect(tmpx, tmpy, 5, 5));
                this.elements.push(this.canvas.rect(tmpx, tmpy + 80, 5, 5));
                this.points.push(new Point(canvas, tmpx, tmpy, String.fromCharCode(97 + j) + i, this));
                this.points.push(new Point(canvas, tmpx, tmpy + 80, String.fromCharCode(102 + j) + i, this));
            }
        let tmp = this.canvas.rect(x + 10, y + 100, 300, 15);
        tmp.attr({ "fill": "#bababa", "stroke": "#bababa" });
        this.elements.push(tmp);
        tmp = canvas.text(x + 310, y + 12, "-");
        tmp.attr({ "fill": "#00f", "font-size": "16" });
        this.elements.push(tmp);

        tmp = canvas.text(x + 310, y + 25, "+");
        tmp.attr({ "fill": "#f00", "font-size": "16" });
        this.elements.push(tmp);

        tmp = canvas.text(x + 310, y + 192, "-");
        tmp.attr({ "fill": "#00f", "font-size": "16" });
        this.elements.push(tmp);

        tmp = canvas.text(x + 310, y + 205, "+");
        tmp.attr({ "fill": "#f00", "font-size": "16" });
        this.elements.push(tmp);
        tmp = canvas.text(x + 315, y + 48, "a");
        this.elements.push(tmp);
        tmp = canvas.text(x + 315, y + 58, "b");
        this.elements.push(tmp);
        tmp = canvas.text(x + 315, y + 68, "c");
        this.elements.push(tmp);
        tmp = canvas.text(x + 315, y + 78, "d");
        this.elements.push(tmp);
        tmp = canvas.text(x + 315, y + 88, "e");
        this.elements.push(tmp);
        tmp = canvas.text(x + 315, y + 128, "f");
        this.elements.push(tmp);
        tmp = canvas.text(x + 315, y + 138, "g");
        this.elements.push(tmp);
        tmp = canvas.text(x + 315, y + 148, "h");
        this.elements.push(tmp);
        tmp = canvas.text(x + 315, y + 158, "i");
        this.elements.push(tmp);
        tmp = canvas.text(x + 315, y + 168, "j");
        this.elements.push(tmp);

        console.log(this.elements.length);
    }
    click() {
        window["isSelected"] = true;
        window["Selected"] = this;
        if (window.showProperties) {
            window.showProperties(() => {
                return this.properties();
            })
        }
    }
    save() {
        return {
            x: this.x,
            y: this.y
        };
    }
    load(data: any): void {
    }
    getNode(point: number[]): Point {
        return null;
    }
    remove(): void {
        for (var e of this.elements)
            e.remove();
        for (var p of this.points)
            p.remove();
        this.elements = [];
        this.points = [];
    }
    properties() {
        let body = document.createElement("div");
        body.innerHTML = "<h6>Breadboard</h6>";
        return {
            key: this.keyName,
            uid: this.id,
            elem: body
        };
    }
}