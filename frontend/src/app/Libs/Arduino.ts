import { Point } from './Point';
import { CircuitElement } from './CircuitElement';

declare var window; // Declare window so that custom created function don't throw error
/**
 * Class for Arduino
 */
export class Arduino extends CircuitElement {
    element: any; // Body of Arduino
    glowing: any; // 
    Nodes: Point[] = []; // Stores all the Nodes of Arduino
    /// Cordinate of Nodes with respect to the body
    NodesCordinates = [
        [91, 13], [99, 13], [106, 13], [113, 13], [120, 13], [127, 13], [135, 13], [142, 13], [154, 13], [161, 13], [168, 13],
        [175, 13], [182, 13], [189, 13], [197, 13], [204, 13],
        [117, 150], [124, 150], [132, 150], [139, 150], [146, 150], [153, 150], [168, 150], [175, 150], [182, 150], [189, 150], [196, 150], [204, 150]
    ];
    // Label for each node
    pinLabesl: string[] = [
        "AREF", "GND", "D13", "D12", "D11", "D10", "D9", "D8", "D7", "D6", "D5", "D4", "D3", "D2", "TX0", "RX0",
        "RESET", "3.3V", "5V", "GND", "GND", "VIN", "A0", "A1", "A2", "A3", "A4", "A5"
    ];
    // on select use this glow details 
    glowdetails: any = {
        width: 2,
        color: "#286bad"
    };
    /**
     * Constructor of Arduino
     * @param canvas Raphael Canvas / paper
     * @param x x position of arduino
     * @param y y position of arduino
     */
    constructor(private canvas: any, public x: number, public y: number) {
        super("Arduino");
        this.id = window.scope["Arduino"].length;
        this.element = this.canvas.image("assets/images/ArduinoUno.svg", this.x, this.y, 228, 167);
        this.draw();
    }
    /**
     * Draw arduino on canvas and set event listener
     */
    draw() {
        // Set click listener on click show propeties and set selected element
        this.element.click(() => {
            window["isSelected"] = true;
            window["Selected"] = this;
            if (window.showProperties) {
                window.showProperties(() => {
                    return this.properties();
                })
            }
        });
        // set drag listener on drag move the arduino and nodes
        this.element.drag((dx, dy) => {
            this.glowing.remove(); // remove glow on drag
            if (this.x > 1000 || this.y > 1000) return;
            // change position of the body
            this.element.attr({
                x: this.x + dx,
                y: this.y + dy
            });
            // create a glow
            this.glowing = this.element.glow(this.glowdetails);
        }, () => {
            // create glow and get the current position of the arduino
            if (this.element.attr && this.element.glow) {
                this.x = this.element.attr("x");
                this.y = this.element.attr("y");
                this.glowing = this.element.glow(this.glowdetails);
            }
        }, () => {
            // if glowing remove the glow
            if (this.glowing)
                this.glowing.remove();
            // get updated position of arduino
            this.x = this.element.attr("x");
            this.y = this.element.attr("y");
            // Move the Nodes on Arduino
            for (let i = 0; i < this.Nodes.length; ++i) {
                this.Nodes[i].move(this.NodesCordinates[i][0] + this.x, this.y + this.NodesCordinates[i][1]);
            }
        });
        // Draw nodes on arduino
        this.drawNodes();
    }
    /**
     * Function Draws nodes (Points) over Arduino
     */
    drawNodes() {
        // get the position of arduino
        this.x = this.element.attr("x");
        this.y = this.element.attr("y");
        // Create new Noded and insert those nodes on the array
        for (let i = 0; i < this.NodesCordinates.length; ++i) {
            let cord = this.NodesCordinates[i];
            this.Nodes.push(new Point(
                this.canvas, this.x + cord[0], this.y + cord[1], this.pinLabesl[i], this
            ));
        }
    }
    /**
     * Show each Node of arduino
     */
    showNodes() {
        for (let point of this.Nodes) {
            point.show();
        }
    }
    /**
     * Hide each Node of arduino
     */
    hideNodes() {
        for (let point of this.Nodes) {
            point.hide();
        }
    }
    /**
     * Return property of arduino
     */
    properties() {
        // Create div and add heading
        let body = document.createElement("div");
        body.innerHTML = "<h6>Arduino</h6>";
        return {
            key:this.keyName,
            uid:this.id,
            elem:body
        }
    }
    /**
     * Remove the arduino and nodes from canvas
     */
    remove() {
        // remove element
        this.element.remove();
        // remove nodes
        for (let nod of this.Nodes) {
            nod.remove();
        }
        this.Nodes = [];
        // remove glowing element
        if (this.glowing)
            this.glowing.remove();
    }
    /**
     * Return object that are required to replicate current arduino instance
     */
    save() {
        return {
            x: this.x,
            y: this.y,
            id: this.id
        };
    }
    /**
     * Initialize arduino from saved object
     * @param data Object to replicate arduino
     */
    load(data) {
        this.x = data.x;
        this.y = data.y;
        this.id = data.id;
    }
    /**
     * Returns node object on the basis of position [x,y]
     * @param point array of length 2 [x,y]
     */
    getNode(point: number[]): Point {
        // Linear search each point
        for (let n of this.Nodes) {
            if (point[0] - 2 == n.x && point[1] - 2 == n.y)
                return n;
        }
        // return null if point not found
        return null;
    }
}
window["Arduino"] = Arduino;