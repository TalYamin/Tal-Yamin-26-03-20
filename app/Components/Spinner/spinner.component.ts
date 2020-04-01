import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})

/* This component is used to show spinner loading until all data is fetched from API*/
export class SpinnerComponent {


}
