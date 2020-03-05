import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { ApiService } from '../api.service';
declare var window;

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
    private router: Router
  ) { }

  ngOnInit() {
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
    { name: "LED", obj: "Led", img: "led.JPG" }
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
    this.loadCanvas = null;
    for (let key in window.scope) {
      window.scope[key] = [];
    }
    this.title = "Untitled";
    this.reload = false;
    this.projectId = -1;
    setTimeout(() => {
      this.reload = true;
    }, 1000)
  }
  saveProject(e: WorkspaceComponent, project) {
    if (!e || !project) return;
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
          if (v["done"]) {
            alert("done");
            this.router.navigate(
              ['.'],
              { relativeTo: this.activatedRoute, queryParams: { project: v['id'] } }
            );
          }
          else
            alert("Not done");
        });
      else {
        this.api.updateProject(this.projectId + '', project.value, JSON.stringify(saveObj), token).subscribe(v => {
          if (v["done"])
            alert("done");
          else
            alert("Not done");
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
