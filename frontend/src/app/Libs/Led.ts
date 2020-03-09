import { Point } from './Point';
import { CircuitElement } from './CircuitElement';

declare var window;// Declare window so that custom created function don't throw error
/**
 * LED class
 */
export class Led extends CircuitElement {
    points: any[][] = [[0, 85], [0, 50], [50, 85]];
    tags: string[] = ["M", "L", "a25,25 180 0,1 50,0 L"];
    color: string = "#f00"; // Color of LED
    body: any; // Body of Led
    leg_plus: any; // Positive terminal of LED
    leg_neg: any; // Negative terminal of LED
    leg_p: Point; // Positive Circuit Node
    leg_n: Point; // Negative Circuit Node

    tmpx: number; // temporary x position
    tmpy: number; // temporary y position
    gloWElement: any;
    /**
     * Constructor for the LED
     * @param canvas Raphael Canvas / paper
     * @param x x position of LED
     * @param y y position of LED
     */
    constructor(private canvas: any, public x: number, public y: number) {
        super("Led");
        this.id = window.scope["Led"].length;
        this.tmpx = this.x;
        this.tmpy = this.y;
        // Create Body of LED composed of two line and a arc
        let tmp = "";
        for (let i = 0; i < this.tags.length; ++i) {
            tmp += this.tags[i] + (this.x + this.points[i][0]) + "," + (this.y + this.points[i][1]) + " ";
        }
        tmp += "Z";
        this.body = this.canvas.path(tmp);
        // Chage fill color
        this.body.attr({ fill: this.color });
        // Create positive terminal as line 
        this.leg_plus = this.canvas.path(`M${this.x + 14},${this.y + 85} L${this.x + 14},${this.y + 140}Z`);
        // Create negative terminal as line 
        this.leg_neg = this.canvas.path(`M${this.x + 36},${this.y + 85} L${this.x + 36},${this.y + 140}Z`);
        // Create node for positive and negative terminal
        this.leg_p = new Point(this.canvas, this.x + 12, this.y + 138, "POSITIVE", this);
        this.leg_n = new Point(this.canvas, this.x + 34, this.y + 138, "NEGATIVE", this);

        // set a click listener
        this.body.click(() => {
            // select the item and show property
            window["isSelected"] = true;
            window["Selected"] = this;
            if (window.showProperties) {
                window.showProperties(() => {
                    return this.properties();
                })
            }
        });
        // set a drag listener
        this.body.drag((dx, dy) => {
            // Update the body position
            let tmp = "";
            for (let i = 0; i < this.tags.length; ++i) {
                tmp += this.tags[i] + (this.x + dx + this.points[i][0]) + "," + (this.y + dy + this.points[i][1]) + " ";
            }
            tmp += "Z";
            this.body.animate({ path: tmp }, 1);
            // Update positive line and node
            this.leg_plus.animate({ path: `M${this.x + dx + 14},${this.y + dy + 85} L${this.x + dx + 14},${this.y + dy + 140}Z` }, 1);
            this.leg_p.move(this.x + dx + 12, this.y + dy + 138);
            // Update negative line and node
            this.leg_neg.animate({ path: `M${this.x + dx + 36},${this.y + dy + 85} L${this.x + dx + 36},${this.y + dy + 140}Z` }, 1);
            this.leg_n.move(this.x + dx + 34, this.y + dy + 138);

            this.tmpx = this.x + dx;
            this.tmpy = this.y + dy;
        }, () => {
            // Change position
            this.x = this.tmpx;
            this.y = this.tmpy;
        }, () => {
            // Change position
            this.x = this.tmpx;
            this.y = this.tmpy;
        });
    }
    // return properties of LED
    properties() {
        // Create div and add a Option for color
        let body = document.createElement('div');
        body.innerHTML = "<h6>LED</h6><label>Color:</label><br>";
        let select = document.createElement("select");
        select.innerHTML = `<option>Red</option><option>Yellow</option><option>Blue</option><option>Green</option>`;
        let colors = ["#ff0000", "#ffff00", "#2593fa", "#31c404"]; // colors array
        for (let i = 0; i < colors.length; ++i)
            if (colors[i] == this.color)
                select.selectedIndex = i;
        // set select on change listener
        select.onchange = () => {
            // on change color set the color of led
            this.setColor(colors[select.selectedIndex]);
        }
        body.append(select);
        return {
            key: this.keyName,
            id: this.id,
            elem: body
        }
    }
    /**
     * Sets the color of LED
     * @param color color of LED
     */
    setColor(color: string) {
        this.color = color;
        this.body.attr({ fill: this.color });
    }
    // Remove LED from canvas
    remove() {
        // remove terminal
        this.leg_p.remove();
        this.leg_n.remove();
        // Remove circuit node
        this.leg_plus.remove();
        this.leg_neg.remove();
        // remove body
        this.body.remove();
        // remove glow
        if (this.gloWElement)
            this.gloWElement.remove();
    }
    // return save object of LED
    save() {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            color: this.color
        };
    }
    // load data from save object
    load(data: any) {
        this.id = data.id;
        this.setColor(data.color);
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