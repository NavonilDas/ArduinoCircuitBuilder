import { Point } from './Point';
import { CircuitElement } from './CircuitElement';

declare var window;

export class Wire extends CircuitElement {
    points: number[][] = [];
    value: number = -1;
    end: Point = null;
    element: any;
    color: any = "#000";

    constructor(public canvas, public start: Point) {
        super("wire");
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

        if (window.showProperties) {
            window.showProperties(() => {
                return this.properties();
            })
        }
    }
    setColor(color: string) {
        this.color = color;
        this.element.attr({ "stroke": color });
    }
    properties() {
        let body = document.createElement('div');
        body.innerHTML = "<h6>Wire</h6><label>Color:</label><br>";
        let select = document.createElement("select");
        select.innerHTML = `<option>Black</option><option>Red</option><option>Yellow</option><option>Blue</option><option>Green</option>`;
        let colors = ["#000","#ff0000", "#ffff00", "#2593fa", "#31c404"];
        for (let i = 0; i < colors.length; ++i)
            if (colors[i] == this.color)
                select.selectedIndex = i;
        select.onchange = () => {
            this.setColor(colors[select.selectedIndex]);
        }
        body.append(select);
        return {
            key: this.keyName,
            uid: this.id,
            elem: body
        }
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
            this.element.attr({ "stroke-linecap": "round", "stroke-width": "4", "stroke": this.color });
        }
    }
    deselect() {
    }
    save() {
        return {
            points: this.points,
            color: this.color,
            start: {
                id: this.start.parent.id,
                keyName: this.start.parent.keyName
            },
            end: {
                id: this.end.parent.id,
                keyName: this.end.parent.keyName
            }
        };
    }
    load(data) {
        this.color = data.color;
        this.points = data.points;
    }
    remove() {
        this.element.remove();
    }
    getNode(p: number[]) {
        return null;
    }
}
window["Wire"] = Wire;