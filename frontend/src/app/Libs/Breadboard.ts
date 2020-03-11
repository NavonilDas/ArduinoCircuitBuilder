import { Point } from './Point';
import { CircuitElement } from './CircuitElement';

declare var window;// Declare window so that custom created function don't throw error

/**
 * Class for Breadboard
 */
export class Breadboard extends CircuitElement {
    Nodes: Point[] = []; // Array to Store Circuit Nodes
    element: any; // Body of the Breadboard
    glowing: any; // Glow Element on click
    // Glow Details
    glowdetails: any = {
        width: 2,
        color: "#286bad"
    };
    // Store Circuit Node on the basis of x and y positon it is necessary for the getNode function
    points: any = {};
    /**
     * Constructor of the breadboard
     * @param canvas Raphael Canvas / paper
     * @param x x position of Breadboard
     * @param y y position of Breadboard
     */
    constructor(private canvas: any, public x: number, public y: number) {
        super("Breadboard");
        this.id = window.scope[this.keyName].length; // Create id
        // Load Body
        this.element = this.canvas.image("assets/images/Breadboard.svg", this.x, this.y, 330, 220);
        // set click listener
        this.element.click(() => this.click());
        // set Drag listener
        this.element.drag((dx, dy) => {
            this.glowing.remove(); // While moving Remove the glow
            if (this.x > 1000 || this.y > 1000) return;
            // Update the position
            this.element.attr({
                x: this.x + dx,
                y: this.y + dy
            });
            // Create the glow object
            this.glowing = this.element.glow(this.glowdetails);
        }, () => {
            // Get Current Position and create glow object
            if (this.element.attr && this.element.glow) {
                this.x = this.element.attr("x");
                this.y = this.element.attr("y");
                this.glowing = this.element.glow(this.glowdetails);
            }
        }, () => {
            // if glow object if present remove it
            if (this.glowing)
                this.glowing.remove();
            // Update the Nodes of the breadboard
            let attr = this.element.attr();
            for (let i = 0; i < this.Nodes.length; ++i) {
                this.Nodes[i].relativeMove(attr.x - this.x, attr.y - this.y);
            }
            // Update x,y positon
            this.x = attr.x;
            this.y = attr.y;
        });
        // Create Circuit nodes
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
    }
    /**
     * Add Circuit Node on the Breadboard
     * @param tx x postion of node
     * @param ty y position of node
     * @param label label of the node
     */
    addPoint(tx: number, ty: number, label: string) {
        let tmp = new Point(this.canvas, tx, ty, label, this); // Create Node object
        // Insert data to the points object
        if (!(tx + "" in this.points)) {
            this.points[tx + ""] = {};
        }
        this.points[tx][ty] = tmp;
        // insert new Node to the node array 
        this.Nodes.push(tmp);
    }
    /**
     * callback for click listener
     */
    click() {
        // Select the current element
        window["isSelected"] = true;
        window["Selected"] = this;
        // Show Properties
        if (window.showProperties) {
            window.showProperties(() => {
                return this.properties();
            })
        }
    }
    /**
     * Returns save object of the Breadboard
     */
    save() {
        return {
            x: this.x,
            y: this.y,
            id: this.id
        };
    }
    /**
     * Load information from data
     * @param data Saved Object
     */
    load(data: any): void {
        this.id = data.id;
    }
    getNode(point: number[]): Point {
        // Check if x,y inside points object if exist return point else return null
        if ((point[0] - 2) + "" in this.points)
            return this.points[(point[0] - 2) + ""][(point[1] - 2) + ""];
        if ((point[0]) + "" in this.points)
            return this.points[(point[0] - 2) + ""][(point[1] - 2) + ""];
        return null;
    }
    // remove object from memory
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