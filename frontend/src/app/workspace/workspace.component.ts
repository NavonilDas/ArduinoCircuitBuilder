import { Component, OnInit, HostListener } from '@angular/core';
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
    if (window.scope[obj]) {
      let tmp = new this.elements[obj](this.canvas, evt.clientX, evt.clientY);
      window.scope[obj].push(tmp);
    }
  }
  UpdateScale() {
    this.scale = Math.min(this.sx / this.width, this.sy / this.height);
    this.canvas.setViewBox(this.x, this.y, this.sx, this.sy, false);
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

  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    event.preventDefault();
    if (event.deltaY < 0)
      this.zoomout();
    else
      this.zoomin();
  }
  UpdateWires() {
    if (window["scope"]["wires"]) {
      for (var z of window["scope"]["wires"]) {
        z.update();
      }
    }
  }
  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    event.preventDefault();
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
    }
  }
  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    event.preventDefault();
    if (this.hold) {
      this.hold = false;
      this.x -= (event.clientX - this.tmpx);
      this.y -= (event.clientY - this.tmpy);
    }
  }
  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if (this.hold) {
      this.view_x = this.x - (event.clientX - this.tmpx);
      this.view_y = this.y - (event.clientY - this.tmpy);
      this.canvas.setViewBox(this.view_x, this.view_y, this.sx, this.sy, false);
    }
    if (window["isSelected"] && (window["Selected"] instanceof Wire)) {
      window.Selected.draw(event.clientX + 5, event.clientY + 5, this.scale);
    }
    this.UpdateWires();
  }
  @HostListener('contextmenu', ['$event']) onContextMenu(event) {
    return false;
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
        height: this.height,
        x: this.view_x,
        y: this.view_y
      }
    }
  }
}
