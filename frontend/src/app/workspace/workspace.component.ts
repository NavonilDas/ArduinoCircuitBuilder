import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Arduino } from 'src/app/Libs/Arduino';
import { Wire } from 'src/app/Libs/Wire';
import { Led } from 'src/app/Libs/Led';
import { PushButton } from 'src/app/Libs/PushButton';
import { Buzzer } from 'src/app/Libs/Buzzer';

declare var Raphael: any;
declare var window: any;
const initWidth: number = 1000;
const initHeight: number = 1000;

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  canvas: any;
  width: number = initWidth;
  height: number = initHeight;
  sx: number = this.width;
  sy: number = this.height;
  view_x: number = 0;
  view_y: number = 0;

  hold: boolean = false;
  hold_clicked: boolean = false;
  x: number = 0;
  y: number = 0;
  elements: any = {
    'Buzzer': Buzzer,
    'Led': Led,
    'Arduino': Arduino,
    'PushButton': PushButton
  };
  tmpx: number;
  tmpy: number;
  scale: number = 1;
  @Input() set canvasData(value: any) {
    if (value) {
      this.load(value.canvas);
      for (let key in value) {
        // console.log(key)
        if (key != "wires" && key != "canvas") {
          for (let el of value[key]) {
            this.loadElement(key, el);
          }
        }

      }
      this.loadWires(value.wires);
    }
  }

  constructor() { }

  ngOnInit() {
    Raphael.fn.showPopup = function (label, x, y) {
      if (label == "") return;
      var ele = document.getElementById("bubblebox");
      ele.innerText = label;
      ele.style.display = "block";
      ele.style.left = (x - ele.clientWidth / 2) + "px";
      ele.style.top = (y + 15) + "px";
    }
    Raphael.fn.hidePopup = function () {
      var ele = document.getElementById("bubblebox");
      ele.style.display = "none";
    }
    this.canvas = Raphael("holder", this.width, this.height);
  }
  /************************** Section For Event Listener ***********************************/

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) public ondrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    var obj = evt.dataTransfer.getData("text");
    this.addCircuitElement(obj, evt.clientX, evt.clientY);
  }

  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    event.preventDefault();
    if (event.deltaY < 0)
      this.zoomout();
    else
      this.zoomin();
  }

  @HostListener('mousedown', ['$event']) onMouseDown(evt: MouseEvent) {
    let event = this.relativePos(evt);

    if (this.hold_clicked) {
      this.hold = true;
      this.tmpx = event.clientX;
      this.tmpy = event.clientY;
    }
    if (window["isSelected"] && (window["Selected"] instanceof Wire)) {
      if (window.Selected.end == null)
        window.Selected.add(event.clientX, event.clientY, this.scale);
    } else {
      if (window["Selected"] && window["Selected"].deselect)
        window["Selected"].deselect();
        window["isSelected"] = false;
        window.hideProperties();
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(evt: MouseEvent) {
    let event = this.relativePos(evt);
    if (this.hold) {
      this.hold = false;
      this.x -= (event.clientX - this.tmpx);
      this.y -= (event.clientY - this.tmpy);
    }
  }

  @HostListener('mousemove', ['$event']) onMouseMove(evt: any) {
    let event = this.relativePos(evt);
    if (this.hold) {
      this.view_x = this.x - (event.clientX - this.tmpx);
      this.view_y = this.y - (event.clientY - this.tmpy);
      this.canvas.setViewBox(this.view_x, this.view_y, this.sx, this.sy, false);
    }
    if (window["isSelected"] && (window["Selected"] instanceof Wire)) {
      window.Selected.draw(event.clientX + 4, event.clientY + 4, this.scale);
    }
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
   * Adds Circuit Element to the canvas
   * @param key Elements Key name
   * @param x X Position
   * @param y Y Position
   */
  addCircuitElement(key: string, x: number, y: number) {
    if (window.scope[key]) {
      let tmp = new this.elements[key](this.canvas, x, y);
      window.scope[key].push(tmp);
      return tmp;
    }
    return null;
  }
  /**
   * Updates Canvas(SVG) ie. Update Viewbox,Width,Height,scale
   */
  UpdateScale() {
    this.scale = Math.min(this.sx / this.width, this.sy / this.height);
    this.canvas.setViewBox(this.view_x, this.view_y, this.sx, this.sy, false);
    this.canvas.setSize(this.width, this.height);
  }

  zoomin() {
    this.sx += 10;
    this.sy += 10;
    if (this.width > initWidth)
      this.width -= 10;
    if (this.height > initHeight)
      this.height -= 10;
    this.UpdateScale();
  }

  zoomout() {
    if (this.sx <= 10) return;
    this.sx -= 10;
    this.sy -= 10;

    this.width += 10;
    this.height += 10;

    this.UpdateScale();
  }

  relativePos(event) {
    event.preventDefault();
    return {
      clientX: event.clientX - 0,
      clientY: event.clientY - 50
    };
  }

  UpdateWires() {
    if (window["scope"]["wires"]) {
      for (var z of window["scope"]["wires"]) {
        z.update();
      }
    }
  }

  holdClick(e: HTMLElement) {
    e.classList.toggle('active-btn');
    console.log(e)
    this.hold_clicked = !this.hold_clicked;
  }

  delete() {
    if (window["Selected"]) {
      window["Selected"].remove();
      if (window["Selected"] instanceof Wire) {
        window.scope.wires.splice(window.Selected.id, 1);
      } else {
        let key = window["Selected"].keyName;
        window.scope[key].splice(window["Selected"].id, 1);
      }
      window["isSelected"] = false;
      window["Selected"] = null;
    }
  }

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
    }
  }

  load(data: any) {
    if (this.canvas == null || this.canvas == undefined) {
      this.ngOnInit();
    }
    this.scale = data.scale;
    this.width = data.width;
    this.height = data.height;
    this.sx = data.viewBox.width;
    this.sy = data.viewBox.height;
    this.view_x = data.viewBox.x;
    this.view_y = data.viewBox.y;
    this.UpdateScale();
  }

  loadElement(key: string, data: any) {
    let obj = this.addCircuitElement(key, data.x, data.y);
    if (obj.load)
      obj.load(data);
  }

  loadWires(wires: any[]) {
    for (let w of wires) {
      let points = w.points;
      let start = null, end = null;
      for (let st of window.scope[w.start.keyName]) {
        if (st.id == w.start.id) {
          start = st.getNode(points[0]);
          break;
        }
      }

      for (let en of window.scope[w.end.keyName]) {
        if (en.id == w.end.id) {
          end = en.getNode(points[points.length - 1]);
          break;
        }
      }
      if (start && end) {
        var tmp = new Wire(this.canvas, start)
        tmp.load(w);
        tmp.connect(end, true);
        console.log("called")
        window["scope"]["wires"].push(tmp);
        tmp.update();
      } else {
        alert("Something went wrong")
      }
      console.log([start, end])
    }
  }
}
