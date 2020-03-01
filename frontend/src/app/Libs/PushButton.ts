import { Point } from './Point';

declare var window;

export class PushButton {
    id:number;
    elements: any[];
    nodes: Point[];
    tmpx: number = 0;
    tmpy: number = 0;
    keyName: string = "PushButton";

    constructor(private canvas: any, public x: number, public y: number) {
        this.id = window.scope["PushButton"].length;
        this.elements = [
            this.canvas.rect(x + 10, y - 20, 5, 30, 5),
            this.canvas.rect(x + 45, y - 20, 5, 30, 5),
            this.canvas.rect(x + 10, y + 50, 5, 30, 5),
            this.canvas.rect(x + 45, y + 50, 5, 30, 5),
            this.canvas.rect(x, y, 60, 60, 10),
            this.canvas.circle(x + 10, y + 10, 5),
            this.canvas.circle(x + 10, y + 50, 5),
            this.canvas.circle(x + 50, y + 10, 5),
            this.canvas.circle(x + 50, y + 50, 5),
            this.canvas.circle(x + 30, y + 30, 12)
        ];
        this.nodes = [
            new Point(canvas, x + 10, y - 20, "Terminal 1b",this),
            new Point(canvas, x + 45, y - 20, "Terminal 2b",this),
            new Point(canvas, x + 10, y + 80, "Terminal 1a",this),
            new Point(canvas, x + 45, y + 80, "Terminal 2a",this)
        ];
        for (let i = 0; i < 4; ++i)
            this.elements[i].attr({ stroke: "#737373", fill: "#737373" });
        this.elements[4].attr({ stroke: "#969696", fill: "#bfbfbf" });
        for (let i = 5; i < 10; ++i)
            this.elements[i].attr({ fill: "#383838", stroke: "#383838" });
            
        for (let i = 0; i < this.elements.length; ++i)
            this.elements[i].drag((dx, dy) => {
                let del_x = (dx - this.tmpx), del_y = (dy - this.tmpy);
                for (let i = 0; i < this.elements.length; ++i) {
                    let attr: any = this.elements[i].attr();
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

                this.tmpx = dx;
                this.tmpy = dy;
            }, () => {
                this.tmpx = 0;
                this.tmpy = 0;
            }, () => {
            });


    }
    save() {
        return {
            x: this.x,
            y: this.y,
            id: this.id
        };
    }
    // returns node pointer on basis of x,y position
    getNode(x: number, y: number) {

    }
}
window["PushButton"] = PushButton;