
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
    constructor(
        private canvas: any,
        public x: number,
        public y: number,
        public label: string
    ) {

        this.element = this.canvas.rect(x, y, 4, 4);
        this.element.attr(this.defaultAttr);

        this.element.hover(() => {
            this.element.attr(this.nodeAttr);
        }, () => {
            this.element.attr(this.defaultAttr);
        });
        this.element.mouseover((evt: MouseEvent) => {
            this.canvas.showPopup(this.label, evt.clientX, evt.clientY);
        });
        this.element.mouseout(() => {
            this.canvas.hidePopup();
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
        }, () => {});
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
    position(){
        return [this.x+2,this.y+2];
    }
}