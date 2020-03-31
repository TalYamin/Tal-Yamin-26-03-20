import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorText: string = "Server error, please try again later";

  constructor(private _router: Router) { }

  /***************************************************************************************************
  * Function Name: ngOnInit()
  * Input: None
  * Output: None
  * Function Operation: ngOnInit() event using to toast error message. 
  ****************************************************************************************************/
  ngOnInit() {
    this.toastFunction();
  }

  toastFunction() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }

 

}
