import { Point } from './Point';
import { CircuitElement } from './CircuitElement';

declare var window;// Declare window so that custom created function don't throw error
/**
 * Class for Wire
 */
export class Wire extends CircuitElement {
    points: number[][] = []; // stores array of position [x,y]
    value: number = -1; // Value of the wire (5,0 -> GND)
    end: Point = null; // End circuit node of wire
    element: any; // body of the wire
    color: any = "#000"; // color of the wire

    /**
     * Constructor of wire
     * @param canvas Raphael Canvas / paper
     * @param start Start circuit node of wire
     */
    constructor(public canvas, public start: Point) {
        super("wire");
        this.id = window.scope["wires"].length;
        // insert the position of start node in array
        this.points.push(start.position());
    }
    /**
     *  
     * @param x 
     * @param y 
     * @param scale 
     */
    draw(x: number, y: number, scale: number = 1) {
        // remove the wire
        if (this.element)
            this.element.remove();
        // change point respective to scale
        x = x * scale;
        y = y * scale;
        // if points are more than 1 then draw a curve
        if (this.points.length > 1) {
            var inp = "M" + this.points[0][0] + "," + this.points[0][1] + " R";
            for (var i = 1; i < this.points.length; ++i) {
                inp += this.points[i][0] + "," + this.points[i][1] + " ";
            }
            inp += x + "," + y;
            // Update path
            this.element = this.canvas.path(inp);
        }
        else {
            // Draw a line
            this.element = this.canvas.path("M" + this.points[0][0] + "," + this.points[0][1] + "L" + x + "," + y);
        }
    }
    /**
     * Add a point to wire
     * @param x x position
     * @param y y position
     * @param scale scale of canvas
     */
    add(x: number, y: number, scale: number = 1) {
        this.points.push([x * scale, y * scale]);
    }
    // Click event callback
    handleClick() {
        // Select current instance
        window["isSelected"] = true;
        window["Selected"] = this;
        // Show properties
        if (window.showProperties) {
            window.showProperties(() => {
                return this.properties();
            })
        }
    }
    /**
     * Set Color of the wire
     * @param color color of the wire
     */
    setColor(color: string) {
        this.color = color;
        this.element.attr({ "stroke": color }); // set attribute
    }
    /**
     * Return properties of wire
     */
    properties() {
        // Create div and insert options form color
        let body = document.createElement('div');
        body.innerHTML = "<h6>Wire</h6><label>Color:</label><br>";
        let select = document.createElement("select");
        select.innerHTML = `<option>Black</option><option>Red</option><option>Yellow</option><option>Blue</option><option>Green</option>`;
        let colors = ["#000", "#ff0000", "#ffff00", "#2593fa", "#31c404"];
        // set the current color
        for (let i = 0; i < colors.length; ++i)
            if (colors[i] == this.color)
                select.selectedIndex = i;
        // set on change listener
        select.onchange = () => {
            // on change update the color
            this.setColor(colors[select.selectedIndex]);
        }
        body.append(select);
        return {
            key: this.keyName,
            uid: this.id,
            elem: body
        }
    }
    /**
     * Function to connect wire with the node
     * @param t End point / END circuit node
     * @param removeLast remove previously inserted item
     */
    connect(t: Point, removeLast: boolean = false) {
        // if remove last then pop from array
        if (removeLast && this.points.length > 2) {
            this.points.pop();
        }
        // change the end variable
        this.end = t;
        // change the value based on the label of end
        if (t.label == "GND") {
            this.value = 0;
        } else if (t.label == "5V") {
            this.value = 5;
        } else if (t.label == "3.3V") {
            this.value = 3.3;
        }
        // insert the end position 
        this.points.push(t.position());
        // Update wire
        this.update();
    }
    /**
     * Update the wire position if the parent element is changed
     */
    update() {
        // check if both start and end node are present
        if (this.end && this.start) {
            // Update the start and ending position
            this.points[0] = this.start.position();
            this.points[this.points.length - 1] = this.end.position();
            // Remove from canvas 
            if (this.element)
                this.element.remove();

            // Draw a curve
            if (this.points.length > 2) {
                var inp = "M" + this.points[0][0] + "," + this.points[0][1] + " R";
                for (var i = 1; i < this.points.length; ++i) {
                    inp += this.points[i][0] + "," + this.points[i][1] + " ";
                }
                this.element = this.canvas.path(inp);
            }
            else {
                // Draw a line
                this.element = this.canvas.path(`M${this.points[0][0]},${this.points[0][1]}L${this.points[1][0]},${this.points[1]}`);
            }
            // set click listener
            this.element.click(() => {
                this.handleClick();
            });
            // change attribute
            this.element.attr({ "stroke-linecap": "round", "stroke-width": "4", "stroke": this.color });
        }
    }
    /**
     * Callback called after the wire is deselect
     */
    deselect() {
    }
    /**
     * Return save object for the wire
     */
    save() {
        return {
            // object contains points,color,start point(id,keyname),end point(id,keybame)
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
    /**
     * Load data from saved object
     * @param data Saved object
     */
    load(data) {
        this.color = data.color;
        this.points = data.points;
    }
    /**
     * Remove wire from canvas
     */
    remove() {
        this.element.remove();
    }
    // No need of this function as it is inherited from CircuitElement class 
    getNode(p: number[]) {
        return null;
    }
}
window["Wire"] = Wire;