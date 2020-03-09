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
  /**
   * Show Property Box
   * @param key Key name of the Circuit Element
   * @param id Circuit Element id
   * @param elem Html Element
   */
  addProperty(key: string, id: string, elem: any) {
    var body = document.getElementById("properties-box");
    // check name and id if it is same element create properties again as it can become slow
    if (body.getAttribute("name") == key && body.getAttribute("uid") == id) return;
    body.setAttribute("name", key);
    body.setAttribute("uid", id);
    body.style.display = "block";
    // Clear Body
    while (body.childNodes.length > 0) {
      body.removeChild(body.lastChild);
    }
    body.append(elem);
  }
  /**
   * Hides Propert box
   */
  hideProperty() {
    var body = document.getElementById("properties-box");
    body.style.display = "none";
    body.setAttribute("name", "null");
    body.setAttribute("uid", "-1");
  }
  /**
   * Show a Toast Message
   * @param message message to be shown
   */
  showToast(message: string) {
    let box = document.getElementById("toast-box");
    box.style.visibility = "visible"
    box.style.opacity = "1";
    box.children[0].innerHTML = message;
    setTimeout(() => {
      box.style.opacity = "0";
      box.style.visibility = "hidden"
    }, 3000);
  }
}
