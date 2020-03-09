import { Wire } from './Wire';

/**
 * Class For Circuit Node ie. Point wires can connect with nodes
 */
export class Point {
    element: any; // body of node
    // Hide node on creation 
    defaultAttr: any = {
        fill: "rgba(0,0,0,0)",
        stroke: "rgba(0,0,0,0)"
    };
    // Show red color with black stroke on hover
    nodeAttr: any = {
        fill: "rgba(255,0,0,1)",
        stroke: "rgba(0,0,0,1)"
    };
    // Hover callback called on hover over node
    hoverCallback: any = null;
    // Hover Close Callback called if hover is removed
    hoverCloseCallback: any = null;
    /**
     * Constructor for Circuit Node
     * @param canvas Raphael Canvas / paper
     * @param x x position of node
     * @param y y position of node
     * @param label label to be shown when hover
     * @param parent parent of the circuit node
     */
    constructor(
        private canvas: any,
        public x: number,
        public y: number,
        public label: string,
        public parent: any
    ) {
        // Create a rectangle of 4x4 and set default color and stroke
        this.element = this.canvas.rect(x, y, 4, 4);
        this.element.attr(this.defaultAttr);
        // Set Hover callback
        this.element.hover(() => {
            // Check if callback is present if it is then call it
            if (this.hoverCallback)
                this.hoverCallback(this.x, this.y);
            this.element.attr(this.nodeAttr); // Change Stroke and fill of the Node
        }, () => {
            // Check if close callback is present if present call it
            if (this.hoverCloseCallback)
                this.hoverCloseCallback(this.x, this.y);
            this.element.attr(this.defaultAttr); // Change Stroke and fill back to default
        });
        // Set Mouse over event
        this.element.mouseover((evt: MouseEvent) => {
            // On mouse over show label
            this.canvas.showPopup(this.label, evt.clientX, evt.clientY);
        });
        // Set mouse out popup
        this.element.mouseout(() => {
            // Close the popup
            this.canvas.hidePopup();
        });
        // Set click listener
        this.element.click(() => {
            /// if node is clicked then check nothing is selected
            if (!window["isSelected"]) {
                // if nothing is selected create a new wire object
                window["isSelected"] = true;
                var tmp = new Wire(this.canvas, this)
                // select the wire and insert into the scope of circuit
                window["Selected"] = tmp;
                window["scope"]["wires"].push(tmp);
            }
            else if (window["isSelected"] && (window["Selected"] instanceof Wire)) {
                // if selected item is wire then connect the wire with the node
                window["Selected"].connect(this, true);
                window["isSelected"] = false; // deselect object
            }
        });

        // TODO: Remove The following code After Development (Testing purpose)
        // this.element.drag((dx, dy) => {
        //     this.element.attr({
        //         x: this.x + dx,
        //         y: this.y + dy
        //     });
        // }, () => {
        //     this.x = this.element.attr("x");
        //     this.y = this.element.attr("y");
        // }, () => { });
        // this.element.dblclick(() => {
        //     alert(this.x + "," + this.y + "   " + this.label);
        // });
        /////////////////
    }
    // Change the scale of the body
    scale(value: number) {
        this.element.scale(value, value);
    }
    /**
     * Remove Node from canvas
     */
    remove() {
        this.element.remove();
    }
    /**
     * Hide Node
     */
    hide() {
        this.element.hide();
    }
    /**
     * Show Node
     */
    show() {
        this.element.show();
    }
    /**
     * Move Node to x,y
     * @param x new x position of Node
     * @param y new y position of Node
     */
    move(x: number, y: number) {
        this.x = x;
        this.y = y;
        // Update the positon
        this.element.attr({
            x: this.x,
            y: this.y
        });
    }
    /**
     * Change the Position of Node with relative to current position
     * @param dx change in x axis
     * @param dy change in y axis
     */
    relativeMove(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
        // update the position
        this.element.attr({
            x: this.x,
            y: this.y
        });
    }
    /**
     * Return the center position of the Node
     */
    position() {
        return [this.x + 2, this.y + 2];
    }
    /**
     * Set Hover and Hover close Callback
     * @param callback Hover Callback
     * @param closeCallback Hover Close Callback
     */
    setHoverCallback(callback = null, closeCallback = null) {
        this.hoverCallback = callback;
        this.hoverCloseCallback = closeCallback;
    }
}