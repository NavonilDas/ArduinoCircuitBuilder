import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Arduino } from 'src/app/Libs/Arduino';
import { Wire } from 'src/app/Libs/Wire';
import { Led } from 'src/app/Libs/Led';
import { PushButton } from 'src/app/Libs/PushButton';
import { Buzzer } from 'src/app/Libs/Buzzer';
import { UiService } from '../ui.service';
import { Breadboard } from '../Libs/Breadboard';

declare var Raphael: any; // External Variable
declare var window: any;
const initWidth: number = 1100; // Default Workspace width
const initHeight: number = 1100; // Default Workspace height

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  canvas: any; // Raphael Canvas / Paper
  width: number = initWidth; // Canvas width
  height: number = initHeight; // Canvas Height
  sx: number = this.width; // Viewbox width
  sy: number = this.height;// Viewox height
  view_x: number = 0; // Viewbox x position
  view_y: number = 0; // Viewbox y position

  hold: boolean = false; // boolean used to move canvas
  hold_clicked: boolean = false; // boolean to store if hold button is clicked
  x: number = 0; // canvas x position
  y: number = 0; // canvas y position
  // Circuit Elements
  elements: any = {
    'Buzzer': Buzzer,
    'Led': Led,
    'Arduino': Arduino,
    'PushButton': PushButton,
    'Breadboard': Breadboard
  };
  tmpx: number; // temporary x
  tmpy: number; // temporary y
  scale: number = 1; // Canvas Scale
  // Setter used if data is loaded from api
  @Input() set canvasData(value: any) {
    if (value) {
      this.load(value.canvas); // Load Canvas
      // Load Circuit Elements except wire
      for (let key in value) {
        if (key != 'wires' && key != 'canvas') {
          for (let el of value[key]) {
            this.loadElement(key, el);
          }
        }
      }
      // Load Wire
      this.loadWires(value.wires);
    }
  }

  constructor(private ui: UiService) { }

  ngOnInit() {
    // Add a Key Up Listener
    window.addEventListener('keyup', (evt: any) => this.onkeyUp(evt));
    // Add a Canvas function to show popup
    // x position of popup label
    // y position of popup label
    Raphael.fn.showPopup = function (label, x, y) {
      if (label == '') return; // id label is empty don't show anything
      const ele = document.getElementById('bubblebox');
      ele.innerText = label;
      ele.style.display = 'block';
      ele.style.left = (x - ele.clientWidth / 2) + 'px';
      ele.style.top = (y + 15) + 'px';
    };
    // Add a Canvas function to hide
    Raphael.fn.hidePopup = function() {
      const ele = document.getElementById('bubblebox');
      ele.style.display = 'none';
    };
    // Create the canvas
    this.canvas = Raphael('holder', this.width, this.height);
  }
  /************************** Section For Event Listener ***********************************/
  /**
   * Drag Over Event callback
   * @param evt Drag Event
   */
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  /**
   * Drag Leave Event Callback
   * @param evt Drag Event
   */
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  /**
   * Drop Event Callback
   * @param evt Drop Event
   */
  @HostListener('drop', ['$event']) public ondrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    const obj = evt.dataTransfer.getData('text'); // get the event data
    this.addCircuitElement(obj, evt.clientX, evt.clientY); // add circuit element on drop
  }
  /**
   * Mouse Wheel Event callback for zoom in zoom out
   * @param event Mouse Event
   */
  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomout();
    } else {
      this.zoomin();
    }
  }
  /**
   * Double click Event listener
   * @param evt Event
   */
  @HostListener('dblclick', ['$event']) onDblClick(evt) {
    window.hideProperties(); // Hide Propeties
    // if selected item is wire then ignore it
    if (window['Selected'] instanceof Wire) { return; }
    // Deselect
    window['isSelected'] = false;
    window['Selected'] = null;
  }
  /**
   * Mouse Down Event listener
   * @param evt Mouse Event
   */
  @HostListener('mousedown', ['$event']) onMouseDown(evt: MouseEvent) {
    // Get Relative position with respect to workspace
    const event = this.relativePos(evt);

    if (this.hold_clicked) {
      // if hold button is clicked
      this.hold = true;
      this.tmpx = event.clientX;
      this.tmpy = event.clientY;
    }
    if (window['isSelected'] && (window['Selected'] instanceof Wire)) {
      // if selected item is wire and it is not connected then add the point
      if (window.Selected.end == null) {
        window.Selected.add(event.clientX, event.clientY, this.scale);
      }
    } else {
      // deselect item
      if (window['Selected'] && window['Selected'].deselect) {
        window['Selected'].deselect();
      }
      window['isSelected'] = false;
    }
  }
  /**
   * Mouse Up Event listener
   * @param evt Mouse Event
   */
  @HostListener('mouseup', ['$event']) onMouseUp(evt: MouseEvent) {
    const event = this.relativePos(evt);
    // if hold is make it false change the x,y position
    if (this.hold) {
      this.hold = false;
      this.x -= (event.clientX - this.tmpx);
      this.y -= (event.clientY - this.tmpy);
    }
  }
  /**
   * Mouse Move Event
   * @param evt Mouse Event
   */
  @HostListener('mousemove', ['$event']) onMouseMove(evt: any) {
    const event = this.relativePos(evt);
    if (this.hold) {
      // if hold is checked move the canvas
      this.view_x = this.x - (event.clientX - this.tmpx);
      this.view_y = this.y - (event.clientY - this.tmpy);
      // Change View Box
      this.canvas.setViewBox(this.view_x, this.view_y, this.sx, this.sy, false);
    }
    // if wire is selected then draw temporary lines
    if (window['isSelected'] && (window['Selected'] instanceof Wire)) {
      window.Selected.draw(event.clientX + 4, event.clientY + 4, this.scale);
    }
    // Update Wires
    this.UpdateWires();
  }
  /**
   * Event Listener called when user press right mouse button
   * @param event Event
   */
  @HostListener('contextmenu', ['$event']) onContextMenu(event) {
    // Disable Context
    return false;
  }
  /**
   * Key Up Callback
   * @param evt Keyboard Event
   */
  onkeyUp(evt: any) {
    evt.preventDefault();
    // if target is INPUT ignore it
    if (evt.target.tagName.toUpperCase() === 'INPUT') {
      return false;
    }
    // if Delete or Backspace is clicked delete the selected item
    if (evt.key === 'Delete' || evt.key === 'Backspace') {
      this.delete();
    }
    return false;
  }

  /**
   * Adds Circuit Element to the canvas
   * @param key Elements Key name
   * @param x X Position
   * @param y Y Position
   */
  addCircuitElement(key: string, x: number, y: number) {
    if (window.scope[key]) {
      // Create new Circuit Element and push it to scope
      const tmp = new this.elements[key](this.canvas, x, y);
      window.scope[key].push(tmp);
      return tmp;
    }
    return null;
  }
  /**
   * Updates Canvas(SVG) ie. Update Viewbox,Width,Height,scale
   */
  UpdateScale() {
    this.scale = Math.min(this.sx / this.width, this.sy / this.height); // update scale
    this.canvas.setViewBox(this.view_x, this.view_y, this.sx, this.sy, false); // change viewbox
    this.canvas.setSize(this.width, this.height); // update width and height
  }
  /**
   * Zoom in Canvas
   */
  zoomin() {
    // Change Width and height and update
    this.sx += 10;
    this.sy += 10;
    if (this.width > initWidth) {
      this.width -= 10;
    }
    if (this.height > initHeight) {
      this.height -= 10;
    }
    this.UpdateScale();
  }
  /**
   * Zoom out from canvas
   */
  zoomout() {
    if (this.sx <= 10) { return; }
    this.sx -= 10;
    this.sy -= 10;

    this.width += 10;
    this.height += 10;

    this.UpdateScale();
  }
  /**
   * Get Relative Mouse Position
   * @param event Mouse Event
   */
  relativePos(event) {
    event.preventDefault();
    return {
      clientX: event.clientX - 0,
      clientY: event.clientY - 50
    };
  }
  /**
   * Update Wire
   */
  UpdateWires() {
    // iterate over each wire and update
    if (window['scope']['wires']) {
      for (const z of window['scope']['wires']) {
        z.update();
      }
    }
  }
  /**
   * Hold button click callback
   * @param e Hold Button
   */
  holdClick(e: HTMLElement) {
    e.classList.toggle('active-btn');
    this.hold_clicked = !this.hold_clicked;
  }
  /**
   * Delete Selected Element
   */
  delete() {
    /// TODO: Implement Recursive way to remove memory
    if (window['Selected']) {
      this.ui.showLoading(); // Show Loading image
      window['Selected'].remove(); // Remove selected from canvas
      // Remve Element from scope
      if (window['Selected'] instanceof Wire) {
        // if it is wire
        window.scope.wires.splice(window.Selected.id, 1);
      } else {
        const key = window['Selected'].keyName;
        const temp = window.scope[key].splice(window['Selected'].id, 1);
        // for(let xx in temp[0]){
        //   console.log(xx)
        // }
        delete temp[0];
      }
      // set selected to null
      window['isSelected'] = false;
      window['Selected'] = null;
      window.hideProperties(); // hide property box
      /// Change id of objects
      for (const key in window.scope) {
        for (let i = 0; i < window.scope[key].length; i++) {
          if (window.scope[key][i].id) {
            window.scope[key][i].id = i;
          }
        }
      }
      this.ui.closeLoading(); // close loading ui
    } else {
      // if nothing is selected show toast
      this.ui.showToast('No Component is Selected');
    }
  }
  /**
   * Return canvas save object
   */
  save() {
    return {
      scale: this.scale,
      width: this.width,
      height: this.height,
      viewBox: {
        width: this.sx,
        height: this.sy,
        x: this.view_x,
        y: this.view_y
      }
    };
  }
  /**
   * Load Canvas properties from saved object
   * @param data Saved canavs data
   */
  load(data: any) {
    if (this.canvas === null || this.canvas === undefined) {
      this.ngOnInit(); // if there is no canvas then create one
    }
    // Load all propeties from data
    this.scale = data.scale;
    this.width = data.width;
    this.height = data.height;
    this.sx = data.viewBox.width;
    this.sy = data.viewBox.height;
    this.view_x = data.viewBox.x;
    this.view_y = data.viewBox.y;
    // Update thing related to canvas
    this.UpdateScale();
  }
  /**
   * Load Circuit Element from data
   * @param key Key Name of Circuit Element
   * @param data Circuit Element Saved data
   */
  loadElement(key: string, data: any) {
    const obj = this.addCircuitElement(key, data.x, data.y);
    if (obj.load) {
      obj.load(data);
    }
  }
  /**
   * Load Wires into canvas
   * @param wires array of saved wire data
   */
  loadWires(wires: any[]) {
    console.log("called")
    for (const w of wires) { // iterate over each wire data
      const points = w.points; // points of wire
      let start = null, end = null; // Store the nodes fetched

      // Use Linear search to find the start circuit node
      for (const st of window.scope[w.start.keyName]) {
        if (st.id === w.start.id) {
          start = st.getNode(points[0]);
          break;
        }
      }
      // Use Linear Search to find the end circuit node
      for (const en of window.scope[w.end.keyName]) {
        if (en.id === w.end.id) {
          end = en.getNode(points[points.length - 1]);
          break;
        }
      }
      // if start and end nodes are present then create wire
      if (start && end) {
        // Create new Wire object
        const tmp = new Wire(this.canvas, start);
        tmp.load(w);
        tmp.connect(end, true); // Join the wire
        // insert wire in scope
        window['scope']['wires'].push(tmp);
        tmp.update(); // Update wire
      } else {
        console.log([start,end]);
        // if start or end node not found then show this message
        // alert('Something went wrong');
      }
    }
  }
}
