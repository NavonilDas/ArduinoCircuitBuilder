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
  projectId: number = -1; // Project id
  loadCanvas: any = null; // object stores property of canvas if project is loaded from database
  title: string = "Untitled"; // Tittle of project
  reload: boolean = true; // Boolean used to reload
  // Components to be shown on the side dock
  components: any[] = [
    { name: "Arduino", obj: "Arduino", img: "arduino.JPG" },
    { name: "Buzzer", obj: "Buzzer", img: "Buzzer.JPG" },
    { name: "Push Button", obj: "PushButton", img: "pushButton.JPG" },
    { name: "LED", obj: "Led", img: "led.JPG" },
    { name: "Breadboard", obj: "Breadboard", img: "Breadboard.JPG" }
  ];
  constructor(
    private activatedRoute: ActivatedRoute, // For retriving Query params
    private api: ApiService,
    private router: Router, // For redirect
    private ui: UiService
  ) { }

  ngOnInit() {
    // Create a global function to show properties box  
    window.showProperties = (callback) => {
      var tmp = callback();
      this.ui.addProperty(tmp.key, tmp.id, tmp.elem);
    }
    // Create a GlobalFunction to hide properties box
    window.hideProperties = () => {
      this.ui.hideProperty();
    }
    // Get Query Parameters and reload simulator
    this.activatedRoute.queryParams.subscribe(p => {
      if (p.project) {
        this.projectId = p.project;
        this.loadProject();
      }
    });
  }
  /**
   * Drag Start Callback
   * @param eve Drag Event
   * @param x Circuit Element key Name
   */
  dragStart(eve, x) {
    eve.dataTransfer.setData("text", x); // set data
    eve.dataTransfer.effectAllowed = "copyMove"; // change cursor icon
  }
  /**
   * Load Project using Project id
   */
  loadProject() {
    var token = window.localStorage.getItem("Token");
    this.api.getProject(this.projectId, token).subscribe((v: any) => {
      //Update title
      this.title = v.title;
      // Update canvas and add Circuit Elements
      this.loadCanvas = JSON.parse(v["data"]);
    });
  }
  /**
   * Click Callback to Create new Project
   */
  newProject() {
    this.ui.showLoading(); // Show loading animation
    // Deselect object
    window["isSelected"] = false;
    window["Selected"] = null;
    this.ui.hideProperty();
    this.loadCanvas = null; // Remove any saved canvas data
    // empty all the scope
    for (let key in window.scope) {
      window.scope[key] = [];
    }
    // Change the title
    this.title = "Untitled";
    this.reload = false;
    this.projectId = -1; // No project id is assigned as it is new project
    setTimeout(() => {
      this.reload = true; // Reload the canvas
      this.ui.closeLoading(); // Hide the close Loading animation
    }, 1000);
  }
  /**
   * Click Callback to save project
   * @param e Workspace Component used in simulator
   * @param project Project title (input reference)
   */
  saveProject(e: WorkspaceComponent, project) {
    if (!e || !project) return;
    this.ui.showLoading(); // Show Loading animation
    var saveObj = {}; // Stored the saved data as object
    saveObj["canvas"] = e.save(); // Stored data regarding canvas
    // Fore each item in window scope
    for (let key in window.scope) {
      saveObj[key] = [];
      // Iterate over each Circuit Element of Specific type and save details
      for (let elem of window.scope[key])
        saveObj[key].push(elem.save());
    }
    // Get User Token from local Storage
    var token = window.localStorage.getItem("Token");
    // Check if token exist if not redirect to login page
    if (token) {
      if (this.projectId === -1)
        // Call the api by passing project title,JSON String of saved data,User Token
        this.api.saveProject(project.value, JSON.stringify(saveObj), token).subscribe(v => {
          let message = "Something Went Wrong"; // message to be show at the end of request
          if (v["done"]) { // if project is saved successfully
            // add query parameters
            this.router.navigate(
              ['.'],
              { relativeTo: this.activatedRoute, queryParams: { project: v['id'] } }
            );
            message = "Done"; // set message as done
          }
          this.ui.closeLoading(); // close the loading animation
          alert(message); // show the message
        }, (err) => {
          // if fetch request caused some error
          this.ui.closeLoading(); // Close loading animation
          alert("Something Went Wrong"); // Show err message
          console.log(err); // Log the error
        });
      else {
        // if project id is already present then update project
        this.api.updateProject(this.projectId + '', project.value, JSON.stringify(saveObj), token).subscribe(v => {
          this.ui.closeLoading(); // Close the loading animation
          alert((v["done"] ? "Done" : "Something Went Wrong")); // Show the message
        }, (err) => {
          // if some error occurs
          this.ui.closeLoading();
          alert("Something Went Wrong");
          console.log(err);
        });

      }
    }
    else
      window.location.href = '/login'; // if token is not present go to login
  }
  /**
   * Title input focus out callback
   * @param evt Event
   */
  onFocusOut(evt) {
    // check if textbox is empty if it is change title back to Untitled
    let el = evt.target;
    if (el.value == "")
      el.value = "Untitled";
  }
}
