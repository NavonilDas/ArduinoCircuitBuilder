import { Wire } from './Wire';

// Class to Draw a Node on Circuit Element
export class Point {
    element: any;
    defaultAttr: any = {
        fill: "rgba(0,0,0,0)",
        stroke: "rgba(0,0,0,0)"
    };
    nodeAttr: any = {
        fill: "rgba(255,0,0,1)",
        stroke: "rgba(0,0,0,1)"
    };
    hoverCallback: any = null;
    hoverCloseCallback: any = null;
    constructor(
        private canvas: any,
        public x: number,
        public y: number,
        public label: string,
        public parent: any
    ) {

        this.element = this.canvas.rect(x, y, 4, 4);
        this.element.attr(this.defaultAttr);

        this.element.hover(() => {
            if (this.hoverCallback)
                this.hoverCallback(this.x,this.y);
            this.element.attr(this.nodeAttr);
        }, () => {
            if (this.hoverCloseCallback)
                this.hoverCloseCallback(this.x,this.y);
            this.element.attr(this.defaultAttr);
        });
        this.element.mouseover((evt: MouseEvent) => {
            this.canvas.showPopup(this.label, evt.clientX, evt.clientY);
        });
        this.element.mouseout(() => {
            this.canvas.hidePopup();
        });
        this.element.click(() => {
            if (!window["isSelected"]) {
                window["isSelected"] = true;
                var tmp = new Wire(this.canvas, this)
                window["Selected"] = tmp;
                window["scope"]["wires"].push(tmp);
            }
            else if (window["isSelected"] && (window["Selected"] instanceof Wire)) {
                window["Selected"].connect(this, true);
                window["isSelected"] = false;
            }
        });
        // TODO: Remove The following code After Development
        this.element.drag((dx, dy) => {
            this.element.attr({
                x: this.x + dx,
                y: this.y + dy
            });
        }, () => {
            this.x = this.element.attr("x");
            this.y = this.element.attr("y");
        }, () => { });
        this.element.dblclick(() => {
            alert(this.x + "," + this.y + "   " + this.label);
        });
        /////////////////
    }
    scale(value: number) {
        this.element.scale(value, value);
    }

    draw() {
    }

    remove() {
        this.element.remove();
    }
    hide() {
        this.element.hide();
    }
    show() {
        this.element.show();
    }
    move(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.element.attr({
            x: this.x,
            y: this.y
        });
    }
    relativeMove(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
        this.element.attr({
            x: this.x,
            y: this.y
        });
    }
    position() {
        return [this.x + 2, this.y + 2];
    }
    setHoverCallback(callback = null, closeCallback = null) {
        this.hoverCallback = callback;
        this.hoverCloseCallback = closeCallback;
    }
}