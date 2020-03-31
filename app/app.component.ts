import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

 
  /* Title and Navigation properties*/ 
  pageTitle = 'Herolo Weather Task';
  homeTitle = "Home";
  favoritesTitle = "Favorites";


  constructor(private _router: Router) {
  }

 /***************************************************************************************************
  * Function Name: ngOnInit()
  * Input: None
  * Output: None
  * Function Operation: ngOnInit() event using to transfer the user to Home component. 
  ****************************************************************************************************/
  ngOnInit(){
    this._router.navigate(["/home"])
  }

}
