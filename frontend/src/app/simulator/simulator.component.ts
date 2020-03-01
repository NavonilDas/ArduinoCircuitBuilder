import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { ApiService } from '../api.service';
declare var window;

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(p => {
      console.log(p);
    })
  }
  components: any[] = [
    { name: "Arduino", obj: "Arduino", img: "arduino.JPG" },
    { name: "Buzzer", obj: "Buzzer", img: "Buzzer.JPG" },
    { name: "Push Button", obj: "PushButton", img: "pushButton.JPG" },
    { name: "LED", obj: "Led", img: "led.JPG" }
  ];
  openProject() {
    window.location.href = '/open';
  }
  test(eve, x) {
    eve.dataTransfer.setData("text", x);
    eve.dataTransfer.effectAllowed = "copyMove";
  }
  loadProject() {

  }
  saveProject(e: WorkspaceComponent, project) {
    var saveObj = {};
    saveObj["canvas"] = e.save();
    for (let key in window.scope) {
      saveObj[key] = [];
      for (let elem of window.scope[key])
        saveObj[key].push(elem.save());
      // console.log(elem.save());
    }
    console.log(JSON.stringify(saveObj));
    var token = window.localStorage.getItem("Token");
    if (token)
      this.api.saveProject(project.value, JSON.stringify(saveObj), token).subscribe(v => {
        if (v["done"])
          alert("done");
        else
          alert("Not done");
      });
    else
      window.location.href = '/login';
  }
  onFocusOut(evt) {
    let el = evt.target;
    if (el.value == "")
      el.value = "Untitled";
  }
}
