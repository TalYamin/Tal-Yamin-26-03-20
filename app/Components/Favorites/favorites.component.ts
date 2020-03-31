import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IFavorite } from 'src/app/Models/IFavorite';
import { LocationService } from 'src/app/Services/location.service';
import { WeatherService } from 'src/app/Services/weather.service';
import { ICity } from 'src/app/Models/ICity';
import { Subscription } from 'rxjs';
import { ICurrent } from 'src/app/Models/ICurrent';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class favoritesComponent implements OnInit, OnDestroy {

  /* Page Properties */
  pageTitle = 'Favorites';
  listFilter : string = "";
  listIsEmpty: boolean = false;

  /* Temperature Properties */
  isTemperatureChecked: boolean;
  temperatureSign: string = "F";

  /* Models */
  city: ICity = {} as any;
  current: ICurrent[] = [];
  favoriteElement: IFavorite = {} as any;
  favoritesList: IFavorite[] = [];
  cityList: ICity[] = [];
  cityToShow: ICity[] = [];

  /* Utils Properties */
  responseString: string
  favoSubscription: Subscription;


  /* CTOR: Dependency Injection of services and Router */
  constructor(private _router: Router, private locationService: LocationService, private weatherService: WeatherService, private route: ActivatedRoute) { }


  /***************************************************************************************************
  * Function Name: ngOnInit()
  * Input: None
  * Output: None
  * Function Operation: ngOnInit() event used to initialize the favorites list which 
  * are stored in session storage. 
  * (1) Receiveing the favorites list from session storage.
  * (2) In case, there is no favorites - onNoResults() is invoked, which notified to user 
  *     there is no favorites.
  * (3) In case, there are favorites - initFavoriteElement() is invoked in order to fill favorites table.
  ****************************************************************************************************/
  ngOnInit() {

    //Receiveing the favorites list from session storage.
    this.cityList = JSON.parse(sessionStorage.getItem("favorites"));

    //In case, there is no favorites - onNoResults() is invoked, notification to user 
    if (this.cityList == null || this.cityList[0] == null) {
      this.onNoResults();
    }

    //In case, there are favorites - initFavoriteElement() is invoked
    else {
      this.listIsEmpty = false;
      for (let i = 0; i < this.cityList.length; i++) {
        const element = this.cityList[i];
        this.initFavoriteElement(element);

      }
    }
  }


  /***************************************************************************************************
  * Function Name: initFavoriteElement()
  * Input: city: ICity
  * Output: None
  * Function Operation: 
  * (1) this function receives city object, and uses WeatherService in order to achieve current 
  *     information about this city from the API.
  * (2) Initialize favorite location according to ICity object and according to current information
  *     from the API.
  * (3) Adding favorite location to favorites list which will be viewed on favorites table.
  * (4) In case of error - error will be logged and navigate to Error component.
  ****************************************************************************************************/
  initFavoriteElement(city: ICity) {

    //Using WeatherService in order to achieve current information about this city from the API
    this.favoSubscription = this.weatherService.getCurrentWeather(city.Key).subscribe(
      (data) => {
        this.current = data;

        //Initialize favorite location according to ICity object and according to current information from API
        let favorite: IFavorite = {} as any;
        favorite.Key = city.Key;
        favorite.CityName = city.CityName;
        favorite.CountryName = city.CountryName;
        favorite.Temperature = this.current[0]?.Temperature.Imperial.Value;
        favorite.WeatherStatus = this.current[0]?.WeatherText;

        //Adding favorite location to favorites list
        this.favoritesList.push(favorite);

      },
      // In case of error - error will be logged
      (err) => { console.log(err); this.responseString = err;  this._router.navigate(["/error"]); }
    )
  }

  /***************************************************************************************************
  * Function Name: removeFavorite()
  * Input: locationKey: string
  * Output: None
  * Function Operation: This function inovked by Remove button on Favorites html, receives
  * location key, and used to remove location from favorites list.
  * (1) Receiveing the favorites list from session storage.
  * (2) Removimg the relevant location acording to location key.  
  * (3) Setting updated favorites list on session storage.
  * (4) Refreshing component in order to show the updated favorites list.
  ****************************************************************************************************/
  removeFavorite(locationKey: string) {

    //Receiveing the favorites list from session storage
    this.cityList = JSON.parse(sessionStorage.getItem("favorites"));
   
    //Removimg the relevant location acording to location key  
    for (var i = 0; i < this.cityList.length; i++) {
      if (this.cityList[i].Key == locationKey) {
        this.cityList.splice(i, 1);
        break;
      }
    }

    //Setting updated favorites list on session storage
    sessionStorage.clear();
    sessionStorage.setItem("favorites", JSON.stringify(this.cityList));

    //Refreshing component in order to show the updated favorites list
    this._router.navigateByUrl("/home", { skipLocationChange: true }).then(() => {
      this._router.navigate(["/favorites"]);
    });
  }

/***************************************************************************************************
  * Function Name: showForecast()
  * Input: locationKey: string
  * Output: None
  * Function Operation: This function inovked by View Forecast button on Favorites html, receives
  * location key, and used to router to Home component and to show there the requested location.
  * (1) Setting "showForecastKey" on session storage with the location key which received.
  * (2) Routing to Home component, there onInit event it will be checked if session storage 
  *     include "showForecastKey".
  ****************************************************************************************************/
  showForecast(locationKey: string) {
    sessionStorage.setItem("showForecastKey", locationKey);
    this._router.navigate(["/home"])
  }

  /***************************************************************************************************
  * Function Name: navigateHome()
  * Input: None
  * Output: None
  * Function Operation: This function inovked by Add Favorites button in Favorites html. This button
  * is showed when there are no any favorites in session storage.
  * This function route to Home component.
  ****************************************************************************************************/
  navigateHome() {
    this._router.navigate(["/home"])
  }

  /***************************************************************************************************
  * Function Name: checkTemperatureValue()
  * Input: event : any
  * Output: None
  * Function Operation: This function is inovked by checkbox slide button in Favorites html.
  * According to check option, receiving the temperature sign - F for fahrenheit and C for celsius.
  ****************************************************************************************************/
 checkTemperatureValue(event: any) {
  this.temperatureSign = event;
}

  /***************************************************************************************************
  * Function Name: onNoResults()
  * Input: None
  * Output: None
  * Function Operation: This function is inovked in case there is no favorites in list.
  ****************************************************************************************************/
 onNoResults() {
    this.responseString = "No Favorites";
    this.listIsEmpty = true;
  }

  /***************************************************************************************************
  * Function Name: ngOnDestroy()
  * Input: None
  * Output: None
  * Function Operation: This event function ngOnDestroy() used to unsubscribe from the Services which
  * have been used.
  ****************************************************************************************************/
  ngOnDestroy(): void {
    if (this.favoSubscription != null) {
      this.favoSubscription.unsubscribe();
    }
  }

}