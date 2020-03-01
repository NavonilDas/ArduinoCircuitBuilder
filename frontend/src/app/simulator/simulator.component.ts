import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(p =>{
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
  onDrag(eve, x) {
    eve.dataTransfer.setData("text", x);
    eve.dataTransfer.effectAllowed = "copyMove";
  }
  saveProject(){

  }
}
