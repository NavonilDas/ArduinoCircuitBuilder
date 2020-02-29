import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message: string = null;
  already: boolean = true;
  constructor(private api: ApiService,private router:Router) { }

  ngOnInit() {
    if (window.localStorage.getItem("Token")) {
      this.already = true;
    } else {
      this.already = false;
    }
  }
  onSubmit(f, evt) {
    evt.preventDefault();
    // console.log(f.value);
    if (f.value.username == "" || f.value.pass == "")
      this.message = "Please Fill Entry";
    else {
      this.saveCredentials(f.value.username, f.value.pass);
    }
  }
  saveCredentials(userName, passwd) {
    this.api.getToken(userName, passwd).subscribe(v => {
      if (v["token"]) {
        window.localStorage.setItem("Token", v["token"])
        this.router.navigate(['/open']);
      } else {
        this.message = "Invalid Credential";
      }
    }, err => {
      if (err.status == 400)
        this.message = "Invalid Credential";
    });
  }
}
