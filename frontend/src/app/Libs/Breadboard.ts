import { Point } from './Point';
import { CircuitElement } from './CircuitElement';

declare var window;// Declare window so that custom created function don't throw error

/**
 * Class for Breadboard
 */
export class Breadboard extends CircuitElement {
    Nodes: Point[] = [];
    element: any;
    glowing: any;
    glowdetails: any = {
        width: 2,
        color: "#286bad"
    };
    points: any = {};
    constructor(private canvas: any, public x: number, public y: number) {
        super("Breadboard");
        this.id = window.scope[this.keyName].length;
        this.element = this.canvas.image("assets/images/Breadboard.svg", this.x, this.y, 330, 220);
        this.element.click(() => this.click());
        this.element.drag((dx, dy) => {
            this.glowing.remove();
            if (this.x > 1000 || this.y > 1000) return;
            if (this.element.attr)
                this.element.attr({
                    x: this.x + dx,
                    y: this.y + dy
                });
            this.glowing = this.element.glow(this.glowdetails);
        }, () => {
            if (this.element.attr && this.element.glow) {
                this.x = this.element.attr("x");
                this.y = this.element.attr("y");
                this.glowing = this.element.glow(this.glowdetails);
            }
        }, () => {
            if (this.glowing)
                this.glowing.remove();
            let attr = this.element.attr();
            for (let i = 0; i < this.Nodes.length; ++i) {
                this.Nodes[i].relativeMove(attr.x - this.x, attr.y - this.y);
            }
            this.x = attr.x;
            this.y = attr.y;
        });

        for (let j = 1; j <= 5; ++j)
            for (let i = 1; i <= 5; ++i) {
                let tmpx = x + 10 + (i - 1) * 10 + (j - 1) * 62;
                this.addPoint(tmpx, y + 12, "-");
                this.addPoint(tmpx, y + 22, "+");
                this.addPoint(tmpx, y + 192, "+");
                this.addPoint(tmpx, y + 202, "-");
            }
        for (let j = 0; j < 5; ++j)
            for (let i = 1; i <= 30; ++i) {
                let tmpx = x + 10 + (i - 1) * 10,
                    tmpy = y + 45 + j * 10;
                this.addPoint(tmpx, tmpy, String.fromCharCode(97 + j) + i);
                this.addPoint(tmpx, tmpy + 80, String.fromCharCode(97 + j) + i);
            }

        console.log(this.points);
    }
    addPoint(tx: number, ty: number, label: string) {
        let tmp = new Point(this.canvas, tx, ty, label, this);
        if (!(tx + "" in this.points)) {
            this.points[tx + ""] = {};
        }
        this.points[tx][ty] = tmp;
        this.Nodes.push(tmp);
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
        if ((point[0] - 2) + "" in this.points)
            return this.points[(point[0] - 2) + ""][(point[1] - 2) + ""];
        if ((point[0]) + "" in this.points)
            return this.points[(point[0] - 2) + ""][(point[1] - 2) + ""];
        return null;
    }
    remove(): void {
        this.element.remove();
        for (var p of this.Nodes)
            p.remove();
        this.Nodes = [];
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