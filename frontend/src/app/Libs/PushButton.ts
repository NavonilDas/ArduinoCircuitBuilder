import { Point } from './Point';
import { CircuitElement } from './CircuitElement';

declare var window;// Declare window so that custom created function don't throw error
/**
 * Class for Push Button
 */
export class PushButton extends CircuitElement {
    elements: any[]; // array of push button body (rectange,circle and 4 terminals)
    nodes: Point[]; // array of Circuit Nodes
    tmpx: number = 0; // temporary x position
    tmpy: number = 0; // temporrary y position

    /**
     * Constructor for Push Button
     * @param canvas Raphael Canvas / paper
     * @param x x position of Push Button
     * @param y y position of Push Button
     */
    constructor(private canvas: any, public x: number, public y: number) {
        super("PushButton");
        this.id = window.scope["PushButton"].length;
        // Create the complete body
        this.elements = [
            this.canvas.rect(x + 10, y - 20, 5, 30, 5), // Terminal 1
            this.canvas.rect(x + 45, y - 20, 5, 30, 5), // Terminal 2
            this.canvas.rect(x + 10, y + 50, 5, 30, 5), // Terminal 3
            this.canvas.rect(x + 45, y + 50, 5, 30, 5), // Terminal 4
            this.canvas.rect(x, y, 60, 60, 10), // Main Rectangle body
            this.canvas.circle(x + 10, y + 10, 5), // Circle 1
            this.canvas.circle(x + 10, y + 50, 5), // Circle 2
            this.canvas.circle(x + 50, y + 10, 5), // Circle 3
            this.canvas.circle(x + 50, y + 50, 5), // Circle 4
            this.canvas.circle(x + 30, y + 30, 12) // Circle at the center
        ];
        // Create new Circuit nodes
        this.nodes = [
            new Point(canvas, x + 10, y - 20, "Terminal 1b", this),
            new Point(canvas, x + 45, y - 20, "Terminal 2b", this),
            new Point(canvas, x + 10, y + 80, "Terminal 1a", this),
            new Point(canvas, x + 45, y + 80, "Terminal 2a", this)
        ];
        // Change fill and stroke of the terminal
        for (let i = 0; i < 4; ++i)
            this.elements[i].attr({ stroke: "#737373", fill: "#737373" });
        // Change fill and stroke of the body
        this.elements[4].attr({ stroke: "#969696", fill: "#bfbfbf" });
        // Change fill and stroke of the circles
        for (let i = 5; i < 10; ++i)
            this.elements[i].attr({ fill: "#383838", stroke: "#383838" });

        for (let i = 0; i < this.elements.length; ++i) {
            // set click listener to every element
            this.elements[i].click(() => {
                // Select current instance and show properties
                window["isSelected"] = true;
                window["Selected"] = this;
                if (window.showProperties) {
                    window.showProperties(() => {
                        return this.properties();
                    })
                }
            });
            // set drag listener to every element
            this.elements[i].drag((dx, dy) => {
                // get change in x and y with respect to previos dx,dy
                let del_x = (dx - this.tmpx), del_y = (dy - this.tmpy);
                /// move every element
                for (let i = 0; i < this.elements.length; ++i) {
                    let attr: any = this.elements[i].attr();
                    // if attribute contains cx then it is a circle hence update its center
                    // else update x and y
                    if (attr["cx"])
                        this.elements[i].attr({ cx: attr.cx + del_x, cy: attr.cy + del_y });
                    else
                        this.elements[i].attr({ x: attr.x + del_x, y: attr.y + del_y });
                }

                // Update Nodes
                // Upper half
                let tmp = this.elements[0].attr();
                this.nodes[0].move(tmp.x, tmp.y - 2);
                tmp = this.elements[1].attr();
                this.nodes[1].move(tmp.x, tmp.y - 2);
                // Lower half
                tmp = this.elements[2].attr();
                this.nodes[2].move(tmp.x, tmp.y + tmp.height - 2);
                tmp = this.elements[3].attr();
                this.nodes[3].move(tmp.x, tmp.y + tmp.height - 2);
                // Update previous to current
                this.tmpx = dx;
                this.tmpy = dy;
            }, () => {
                // set previous change to 0
                this.tmpx = 0;
                this.tmpy = 0;
            }, () => {
                /// UPDATE x,y
                let attr = this.elements[0].attr();
                this.x = attr.x - 10;
                this.y = attr.y + 20;
            });
        }
    }
    // return properties of the push button
    properties() {
        // create div and append html
        let body = document.createElement("div");
        body.innerHTML = "<h6>Push Button</h6>";
        return {
            key: this.keyName,
            uid: this.id,
            elem: body
        };
    }
    // Remove Push button from canvas
    remove() {
        for (let e of this.elements) {
            e.remove();
        }
    }
    // Return the object for recreation
    save() {
        return {
            x: this.x,
            y: this.y,
            id: this.id
        };
    }
    // Load data from saved object
    load(data) {
        this.id = data.id;
    }
    // returns node pointer on basis of x,y position
    getNode(point: any): Point {
        for (var t of this.nodes) {
            if (point[0] - 2 == t.x && point[1] == t.y) {
                return t;
            }
        }
        return null;
    }
}
window["PushButton"] = PushButton;