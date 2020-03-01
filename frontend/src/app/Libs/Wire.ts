import { Point } from './Point';

declare var window;

export class Wire {
    id: number;
    points: number[][] = [];
    value: number = -1;
    end: Point = null;
    element: any;
    constructor(public canvas, public start: Point) {
        this.id = window.scope["wires"].length;
        this.points.push(start.position());
    }
    draw(x: number, y: number, scale: number = 1) {
        if (this.element)
            this.element.remove();

        x = x * scale;
        y = y * scale;

        if (this.points.length > 1) {
            var inp = "M" + this.points[0][0] + "," + this.points[0][1] + " R";
            for (var i = 1; i < this.points.length; ++i) {
                inp += this.points[i][0] + "," + this.points[i][1] + " ";
            }
            inp += x + "," + y;
            this.element = this.canvas.path(inp);
        }
        else {
            this.element = this.canvas.path("M" + this.points[0][0] + "," + this.points[0][1] + "L" + x + "," + y);
        }
    }
    add(x: number, y: number, scale: number = 1) {
        this.points.push([x * scale, y * scale]);
    }
    handleClick() {
        window["isSelected"] = true;
        window["Selected"] = this;
        console.log(this.value);
    }
    connect(t: Point, removeLast: boolean = false) {
        if (removeLast && this.points.length > 2) {
            this.points.pop();
        }
        this.end = t;
        if (t.label == "GND") {
            this.value = 0;
        } else if (t.label == "5V") {
            this.value = 5;
        } else if (t.label == "3.3V") {
            this.value = 3.3;
        }
        this.points.push(t.position());
        this.update();
    }
    update() {
        if (this.end && this.start) {
            this.points[0] = this.start.position();
            this.points[this.points.length - 1] = this.end.position();
            if (this.element)
                this.element.remove();
            if (this.points.length > 2) {
                var inp = "M" + this.points[0][0] + "," + this.points[0][1] + " R";
                for (var i = 1; i < this.points.length; ++i) {
                    inp += this.points[i][0] + "," + this.points[i][1] + " ";
                }
                this.element = this.canvas.path(inp);
            }
            else {
                this.element = this.canvas.path(`M${this.points[0][0]},${this.points[0][1]}L${this.points[1][0]},${this.points[1]}`);
            }
            this.element.click(() => {
                this.handleClick();
            });
            this.element.attr({ "stroke-linecap": "round", "stroke-width": "4" });

        }
    }
    deselect() {
        console.log("called");
    }
    save() {

    }
    load() {
    }
    remove() {
        this.element.remove();
    }
}
window["Wire"] = Wire;