import { Point } from './Point';

declare var window;

export class Arduino {
    id: number;
    keyName: string = "Arduino";
    element: any;
    glowing: any;
    Nodes: Point[] = [];
    NodesCordinates = [
        [91, 13], [99, 13], [106, 13], [113, 13], [120, 13], [127, 13], [135, 13], [142, 13], [154, 13], [161, 13], [168, 13],
        [175, 13], [182, 13], [189, 13], [197, 13], [204, 13],
        [117, 150], [124, 150], [132, 150], [139, 150], [146, 150], [153, 150], [168, 150], [175, 150], [182, 150], [189, 150], [196, 150], [204, 150]
    ];
    pinLabesl: string[] = [
        "AREF", "GND", "D13", "D12", "D11", "D10", "D9", "D8", "D7", "D6", "D5", "D4", "D3", "D2", "TX0", "RX0",
        "RESET", "3.3V", "5V", "GND", "GND", "VIN", "A0", "A1", "A2", "A3", "A4", "A5"
    ];
    glowdetails: any = {
        width: 2,
        color: "#286bad"
    };
    constructor(private canvas: any, public x: number, public y: number) {
        this.id = window.scope["Arduino"].length;
        this.element = this.canvas.image("assets/images/ArduinoUno.svg", this.x, this.y, 228, 167);
        this.draw();
    }
    move() {

    }
    draw() {
        this.element.click(() => {
            window["isSelected"] = true;
            window["Selected"] = this;
        });
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
            this.x = this.element.attr("x");
            this.y = this.element.attr("y");

            for (let i = 0; i < this.Nodes.length; ++i) {
                this.Nodes[i].move(this.NodesCordinates[i][0] + this.x, this.y + this.NodesCordinates[i][1]);
            }
        });
        this.drawNodes();
    }
    drawNodes() {
        this.x = this.element.attr("x");
        this.y = this.element.attr("y");

        for (let i = 0; i < this.NodesCordinates.length; ++i) {
            let cord = this.NodesCordinates[i];
            this.Nodes.push(new Point(
                this.canvas, this.x + cord[0], this.y + cord[1], this.pinLabesl[i], this
            ));
        }
    }
    showNodes() {
        for (let point of this.Nodes) {
            point.show();
        }
    }
    hideNodes() {
        for (let point of this.Nodes) {
            point.hide();
        }
    }
    scale(value: number) {

    }
    remove() {
        console.log("called");
        this.element.remove();
        for (let nod of this.Nodes) {
            nod.remove();
        }
        this.Nodes = [];
        if (this.glowing)
            this.glowing.remove();
    }
    save() {
        return {
            x: this.x,
            y: this.y,
            id: this.id
        };
    }
    load(data){
        this.x = data.x;
        this.y = data.y;
        this.id = data.id;
    }
    // returns node pointer on basis of x,y position
    getNode(x: number, y: number) {

    }
}
window["Arduino"] = Arduino;