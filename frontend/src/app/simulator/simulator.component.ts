import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { ApiService } from '../api.service';
import { UiService } from '../ui.service';
declare var window;// Declare window so that custom created function don't throw error

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {
  projectId: number = -1;
  loadCanvas: any = null;
  title: string = "Untitled";
  reload: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private ui: UiService
  ) { }

  ngOnInit() {
    window.showProperties = (callback) => {
      var tmp = callback();
      this.ui.addProperty(tmp.key, tmp.id, tmp.elem);
    }
    window.hideProperties = () => {
      this.ui.hideProperty();
    }

    this.activatedRoute.queryParams.subscribe(p => {
      if (p.project) {
        this.projectId = p.project;
        this.loadProject();
      }
    });
  }
  components: any[] = [
    { name: "Arduino", obj: "Arduino", img: "arduino.JPG" },
    { name: "Buzzer", obj: "Buzzer", img: "Buzzer.JPG" },
    { name: "Push Button", obj: "PushButton", img: "pushButton.JPG" },
    { name: "LED", obj: "Led", img: "led.JPG" },
    { name: "Breadboard", obj: "Breadboard", img: "Breadboard.JPG" }
  ];
  test(eve, x) {
    eve.dataTransfer.setData("text", x);
    eve.dataTransfer.effectAllowed = "copyMove";
  }
  loadProject() {
    var token = window.localStorage.getItem("Token");
    this.api.getProject(this.projectId, token).subscribe((v: any) => {
      //Update title
      this.title = v.title;
      // Update canvas and add Circuit Elements
      this.loadCanvas = JSON.parse(v["data"]);
    });
  }
  newProject() {
    this.ui.showLoading();
    window["isSelected"] = false;
    window["Selected"] = null;
    this.loadCanvas = null;
    for (let key in window.scope) {
      window.scope[key] = [];
    }
    this.title = "Untitled";
    this.reload = false;
    this.projectId = -1;
    setTimeout(() => {
      this.reload = true;
      this.ui.closeLoading();
    }, 1000)
  }
  saveProject(e: WorkspaceComponent, project) {
    if (!e || !project) return;
    this.ui.showLoading();
    var saveObj = {};
    saveObj["canvas"] = e.save();
    for (let key in window.scope) {
      saveObj[key] = [];
      for (let elem of window.scope[key])
        saveObj[key].push(elem.save());
    }
    var token = window.localStorage.getItem("Token");
    if (token) {
      if (this.projectId === -1)
        this.api.saveProject(project.value, JSON.stringify(saveObj), token).subscribe(v => {
          let message = "Something Went Wrong";
          if (v["done"]) {
            this.router.navigate(
              ['.'],
              { relativeTo: this.activatedRoute, queryParams: { project: v['id'] } }
            );
            message = "Done";
          }
          this.ui.closeLoading();
          alert(message);
        }, (err) => {
          this.ui.closeLoading();
          alert("Something Went Wrong");
          console.log(err);
        });
      else {
        this.api.updateProject(this.projectId + '', project.value, JSON.stringify(saveObj), token).subscribe(v => {
          this.ui.closeLoading();
          alert((v["done"] ? "Done" : "Something Went Wrong"))
        }, (err) => {
          this.ui.closeLoading();
          alert("Something Went Wrong");
          console.log(err);
        });
        
      }
    }
    else
      window.location.href = '/login';
  }
  onFocusOut(evt) {
    let el = evt.target;
    if (el.value == "")
      el.value = "Untitled";
  }
}
