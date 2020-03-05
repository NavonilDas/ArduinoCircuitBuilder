import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor() { }
  /**
   * Show Loading Animation
   */
  showLoading() {
    var el = document.getElementById('loading-anim');
    el.style.display = "flex";
  }
  /**
   * Close Loading Animation
   */
  closeLoading() {
    var el = document.getElementById('loading-anim');
    el.style.display = "none";
  }
}
