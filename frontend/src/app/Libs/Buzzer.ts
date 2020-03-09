import { Point } from './Point';
import { CircuitElement } from './CircuitElement';

declare var window;// Declare window so that custom created function don't throw error
/**
 * Buzzer Class
 */
export class Buzzer extends CircuitElement {
    leg_plus: any; // Positive terminal line
    leg_neg: any; // Negative terminal line
    leg_p: Point; // Positive Node
    leg_n: Point; // Negative Node
    outer: any; // Buzzer outer circle
    inner: any; // Buzzer inner circle
    tmpx: number; // Store temporary x position
    tmpy: number; // Store temporary y position

    constructor(private canvas: any, public x: number, public y: number) {
        super("Buzzer");
        this.id = window.scope["Buzzer"].length;

        this.tmpx = x;
        this.tmpy = y;
        // Create terminal
        this.leg_plus = this.canvas.path(`M${this.x - 15},${this.y + 20} L${this.x - 15},${this.y + 50}Z`);
        this.leg_neg = this.canvas.path(`M${this.x + 15},${this.y + 20} L${this.x + 15},${this.y + 50}Z`);
        // Create outer circle and fill color
        this.outer = this.canvas.circle(x, y, 30);
        this.outer.attr({ fill: "#383838", stroke: "#383838" });
        // Create inner circle and fill color
        this.inner = this.canvas.circle(x, y, 5);
        this.inner.attr({ fill: "#b07425", stroke: "#b07425" });
        // Create Circuit Node
        this.leg_p = new Point(canvas, x - 17, y + 48, "POSITIVE", this);
        this.leg_n = new Point(canvas, x + 13, y + 48, "NEGATIVE", this);

        // Set click listener
        this.outer.click(() => {
            // select current breadboard
            window["isSelected"] = true;
            window["Selected"] = this;
            // show properties
            if (window.showProperties) {
                window.showProperties(() => {
                    return this.properties();
                })
            }
        });
        // set drag listener
        this.outer.drag((dx, dy) => {
            // update position of inner and outer circle
            this.outer.attr({ cx: this.x + dx, cy: this.y + dy });
            this.inner.attr({ cx: this.x + dx, cy: this.y + dy });
            // Update position of terminal line
            this.leg_plus.animate({ path: `M${this.x + dx - 15},${this.y + dy + 20} L${this.x + dx - 15},${this.y + dy + 50}Z` }, 1);
            this.leg_neg.animate({ path: `M${this.x + dx + 15},${this.y + dy + 20} L${this.x + dx + 15},${this.y + dy + 50}Z` }, 1);
            // Update circuit node
            this.leg_p.move(this.x + dx - 17, this.y + dy + 48);
            this.leg_n.move(this.x + dx + 13, this.y + dy + 48);
            // Update tempoary position
            this.tmpx = this.x + dx;
            this.tmpy = this.y + dy;
        }, () => {
            // Get Changed position
            this.x = this.tmpx;
            this.y = this.tmpy;
        }, () => {
            // Get Changed position
            this.x = this.tmpx;
            this.y = this.tmpy;
        });
    }
    // return propeties object
    properties() {
        let body = document.createElement("div");
        body.innerHTML = "<h6>Buzzer</h6>";
        return {
            key: this.keyName,
            uid: this.id,
            elem: body
        };
    }
    // remove element from canvas
    remove(): void {
        // remove terminal
        this.leg_neg.remove();
        this.leg_plus.remove();
        // remove inner and outer circle
        this.outer.remove();
        this.inner.remove();
    }
    // return save object 
    save() {
        return {
            x: this.x,
            y: this.y,
            id: this.id
        };
    }
    // load data from saved object
    load(data: any) {
        this.x = data.x;
        this.y = data.y;
        this.id = data.id;
    }
    // returns node pointer on basis of x,y position
    getNode(point: number[]) {
        if (this.leg_p.x == point[0] - 2 && this.leg_p.y == point[1] - 2)
            return this.leg_p;
        if (this.leg_n.x == point[0] - 2 && this.leg_n.y == point[1] - 2)
            return this.leg_n;
        return null;
    }
    // TODO: Play Music on Simulation
}
// Load Buzzer globally
window["Buzzer"] = Buzzer;