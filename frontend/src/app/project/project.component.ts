import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  constructor(private api: ApiService, private router: Router) { }
  items: any[] = [];
  ngOnInit() {
    var token = window.localStorage.getItem("Token");
    if (token)
      this.api.getProjects(token).subscribe(v => {
        this.items = v;
      });
    else {
      this.router.navigate(["/login"]);
    }
  }
  getQuery(item:any) {
    return {
      project: `${item.id}`
    };
  }
}
