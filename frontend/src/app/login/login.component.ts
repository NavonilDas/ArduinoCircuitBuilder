import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message: string = null; // Message Over the form
  already: boolean = true; // if already present show link to open project
  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    // Check if token is already present or not
    if (window.localStorage.getItem("Token")) {
      this.already = true;
    } else {
      this.already = false;
    }
  }
  /**
   * Submit Callback
   * @param f Form Reference
   * @param evt Event
   */
  onSubmit(f, evt) {
    evt.preventDefault();
    // Check if username and password is not empty
    if (f.value.username == "" || f.value.pass == "")
      this.message = "Please Fill Entry";
    else {
      // request token using username and password
      this.saveCredentials(f.value.username, f.value.pass);
    }
  }
  /**
   * Get User Token and save it to local storage
   * @param userName Username
   * @param passwd  Password of the USer
   */
  saveCredentials(userName, passwd) {
    this.api.getToken(userName, passwd).subscribe(v => {
      if (v["token"]) {
        // if token is present save it to local storage
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
