import { Component, OnInit, Output, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocationService } from 'src/app/Services/location.service';
import { WeatherService } from 'src/app/Services/weather.service';
import { IForecast } from 'src/app/Models/IForecast';
import { ILocation } from 'src/app/Models/ILocation';
import { ICurrent } from 'src/app/Models/ICurrent';
import { ICity } from 'src/app/Models/ICity';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  /* Icon Properties */
  imageWidth: number = 100;
  imageMargin: number = 2;
  upperImageWidth: number = 50;
  upperImageMargin: number = 2;
  iconNum: number;

  /* Search Properties */
  localName: string;
  citySearchString: string;
  countrySearchString: string;

  /* Temperature Properties */
  isTemperatureChecked: boolean;
  temperatureSign: string = "F";

  /* Favorite Properties */
  isFavorite: boolean = false;

  /* Models */
  forecast: IForecast;
  zones: ILocation[] = [];
  current: ICurrent[] = {} as any;
  city: ICity = {} as any;
  cityList: ICity[] = [];

  /* Utils Properties */
  responseString: string;
  homeSubscription: Subscription = null;


  /* CTOR: Dependency Injection of services */
  constructor(private _router: Router, private locationService: LocationService, private weatherService: WeatherService) { }


  /***************************************************************************************************
  * Function Name: ngOnInit()
  * Input: None
  * Output: None
  * Function Operation: ngOnInit() event using to achieve information from the server and to insert it
  * to model and template, in order to create binding. 
  * (1) There is checking of routing from Favorites component with required location.
  * (2) In case, there is no routing from Favorites component - default location will be viewed. 
  * (3) In order to insert infromation to model and template - there is using  initLocationView() function.
  ****************************************************************************************************/
  ngOnInit() {

    //checking of routing from Favorites component with required favorite location by session properties
    const showForecastKey = sessionStorage.getItem("showForecastKey");

    //In case there is routing with required favorite location
    if (showForecastKey !== null) {
      this.cityList = JSON.parse(sessionStorage.getItem("favorites"));


      /*Initilaize full infromation of the favorite location by the key which transfer
       with session from Favorite component */
      for (let i = 0; i < this.cityList.length; i++) {
        const element = this.cityList[i];

        if (element.Key == showForecastKey) {
          this.citySearchString = element.CityName;
          this.countrySearchString = element.CountryName;
          this.initLocationView();
        }
      }

    }

    //In case there is no required favorite location, default location will be viewed
    else {

      this.citySearchString = "Tel Aviv";
      this.countrySearchString = "Israel";
      this.initLocationView();
    }

    sessionStorage.removeItem("showForecastKey");

  }


  /* Search Functions */

  /***************************************************************************************************
  * Function Name: getInputSearch()
  * Input: event - The string which has been filled in input search in home.component.html 
  * Output: None
  * Function Operation: This function receives changed string which used to find autocomplete options
  * of locations. The search is invoked by autoCompleteSearch() function. 
  ****************************************************************************************************/
  getInputSearch($event) {
    let inputSearchString = (<HTMLInputElement>document.getElementById('inputSearchString')).value;
    if (inputSearchString.length > 0) {
      this.autoCompleteSearch(inputSearchString);
    }
  }

  /***************************************************************************************************
  * Function Name: autoCompleteSearch()
  * Input: locationString: string
  * Output: None
  * Function Operation: This function recieves the required location from input search. 
  * There is using of LocationService in order to achieve Data from API.  
  * In case of error - error will be logged and navigate to Error component.
  ****************************************************************************************************/
  autoCompleteSearch(inputSearchString: string) {
    this.homeSubscription = this.locationService.getLocations(inputSearchString).subscribe(
      (data) => {
        this.zones = data;
      },

      //In case of error, error will be logged.
      (err) => { console.log(err); this.responseString = err; this._router.navigate(["/error"]);}
    )
  }

  /* View Functions */

  /***************************************************************************************************
  * Function Name: initLocationView()
  * Input: None
  * Output: None
  * Function Operation: This function enables to initialize the view by the required location.
  * (1) At first, there is checking if there are search input. If not - default location will be viewed.
  * (2) There is using LocationService in order to recieve all the info of the chosen location from API.
  * (3) When the required location was verified, there are using in sub function to get more infromation
  *     about the required location. Using viewCurrnet(), viewForecast(), checkFavoriteOption().
  * (4) In case of error - error will be logged and navigate to Error component.
  ****************************************************************************************************/
  initLocationView() {

    // Receiving the input search from html and split it to city and country.
    let chosenLocation = (<HTMLInputElement>document.getElementById('inputSearchString')).value;
    let array = chosenLocation.split(",");
    let chosenCity: string;
    let chosenCountry: string;


    //Iniitalize chosenCity -  by input search or by default location
    if (chosenLocation == "") {
      chosenCity = this.citySearchString;
      chosenCountry = this.countrySearchString;
    }
    else {
      chosenCity = array[0];
      chosenCountry = array[1];
    }

    //Using LocationService in order to recieve all the info of the chosen city from API
    this.homeSubscription = this.locationService.getLocations(chosenCity).subscribe(
      (data) => {
        this.zones = data;
        if (this.zones == null) {
          this.onNoResults();
        }
        else {
          /* In case there are several options of locations which defined by the chosen city.
          there is checking of match of city and country of any location which received from API*/
          for (let i = 0; i < this.zones.length; i++) {
            const element = this.zones[i];

            /*In case the relevant location found, there is using in sub function to get more info of the
            required location */
            if (element.LocalizedName === chosenCity && element.Country.LocalizedName === chosenCountry) {
              sessionStorage.setItem("zone", JSON.stringify(element));
              this.localName = element.LocalizedName + ", " + element.Country.LocalizedName;
              this.viewCurrnet(element.Key)
              this.viewForecast(element.Key)
              this.checkFavoriteOption(element);
              break;
            }
          }
        }
      },
      //In case of error, error will be logged.
      (err) => { console.log(err); this.responseString = err; this._router.navigate(["/error"]); }
    )
  }

  /***************************************************************************************************
  * Function Name: viewCurrnet()
  * Input: locationKey: string
  * Output: None
  * Function Operation: This function receives location key and used to achieve the current infromation
  * about this specific location. This function use  WeatherService in order to receive the data from API.
  * In case of error - error will be logged and navigate to Error component.
  ****************************************************************************************************/
  viewCurrnet(locationKey: string) {
    this.homeSubscription = this.weatherService.getCurrentWeather(locationKey).subscribe(
      (data) => {
        this.current = data;
      },
      (err) => { console.log(err); this.responseString = err;  this._router.navigate(["/error"]);}
    )
  }

  /***************************************************************************************************
   * Function Name: viewForecast()
   * Input: locationKey: string
   * Output: None
   * Function Operation: This function receives location key and used to achieve the forecast infromation
   * about this specific location. This function use  WeatherService in order to receive the data from API.
   * In case of error - error will be logged and navigate to Error component.
   ****************************************************************************************************/
  viewForecast(locationKey: string) {
    this.homeSubscription = this.weatherService.getForecast(locationKey).subscribe(
      (data) => {
        this.forecast = data;
      },
      (err) => { console.log(err); this.responseString = err;  this._router.navigate(["/error"]); }
    )
  }


  /* Icon Functions */

  /***************************************************************************************************
  * Function Name: getIcon()
  * Input: forecastNum: number
  * Output: string - link to icon 
  * Function Operation: This function receives number of the forecast day and used to achieve the relevant
  * icon link of this spesifice forecast day. 
  ****************************************************************************************************/
  getIcon(forecastNum: number) {
    this.iconNum = this.forecast?.DailyForecasts[forecastNum].Day.Icon;
    return "./assets/icons/" + this.iconNum + "-s.png";
  }

  /***************************************************************************************************
  * Function Name: getCurrentIcon()
  * Input: None
  * Output: string - link to icon 
  * Function Operation: This function used to achieve the relevant icon link of the current weather. 
  ****************************************************************************************************/
  getCurrentIcon() {
    this.iconNum = this.current[0]?.WeatherIcon;
    return "./assets/icons/" + this.iconNum + "-s.png";
  }


  /* Favorite Functions */

  /***************************************************************************************************
  * Function Name: changeFavorite()
  * Input: None
  * Output: isFavorite : boolean 
  * Function Operation: This function is invoked by Favorite button in Home html.
  * (1) At first, there is initilazing of the current required location. 
  * (2) In case the location is not favorite: add it to favorites list and update the session storage. 
  * (3) In case the location is favorite: remove it from favorites list and update the session storage.
  * (4) Return the value of boolean isFavorite.
  ****************************************************************************************************/
  changeFavorite() {


    // Initilazing of the current required location 
    let zone = JSON.parse(sessionStorage.getItem("zone"));
    this.city.Key = zone.Key;
    this.city.CityName = zone.LocalizedName;
    this.city.CountryName = zone.Country.LocalizedName;

    //In case the location is not favorite: add it to favorites list and update the session storage
    if (this.isFavorite == false) {
      this.cityList = JSON.parse(sessionStorage.getItem("favorites"))
      if (this.cityList === null) {
        this.cityList = [];
      }
      this.cityList.push(this.city);
      sessionStorage.clear();
      sessionStorage.setItem("zone", JSON.stringify(zone));
      sessionStorage.setItem("favorites", JSON.stringify(this.cityList));
      return this.addFavorite();
    }

    //In case the location is favorite: remove it from favorites list and update the session storage
    else {
      this.cityList = JSON.parse(sessionStorage.getItem("favorites"))
      var key = this.city.Key;
      for (var i = 0; i < this.cityList.length; i++) {
        if (this.cityList[i].Key == key) {
          this.cityList.splice(i, 1);
          break;
        }
      }
      sessionStorage.clear();
      sessionStorage.setItem("zone", JSON.stringify(zone));
      sessionStorage.setItem("favorites", JSON.stringify(this.cityList));
      return this.removeFavorite();
    }

  }

  /***************************************************************************************************
  * Function Name: addFavorite()
  * Input: None
  * Output: isFavorite : boolean 
  * Function Operation: Sub function of changeFavorite() to change boolean to true and return. 
  ****************************************************************************************************/
  addFavorite() {
    this.isFavorite = true;
    return this.isFavorite;
  }

  /***************************************************************************************************
  * Function Name: removeFavorite()
  * Input: None
  * Output: isFavorite : boolean 
  * Function Operation: Sub function of changeFavorite() to change boolean to false and return. 
  ****************************************************************************************************/
  removeFavorite() {
    this.isFavorite = false;
    return this.isFavorite;
  }

  /***************************************************************************************************
  * Function Name: checkFavoriteOption()
  * Input: zone : ILocation
  * Output: None
  * Function Operation: This function used to initialize the relevant view of the required location, 
  * In case this location was marked as favorite. 
  * (1) Receiveing ILocation object and initializng city by the relevant properties. 
  * (2) Receiveing favorites list from session storage.
  * (3)Checking if the required location is one of favorites.
  *    In case it is favorite, change isFavorite boolean by addFavorite(). 
  ****************************************************************************************************/
  checkFavoriteOption(zone: ILocation) {

    this.isFavorite = false;

    // Initializng city by the relevant properties from ILocation object
    this.city.Key = zone.Key;
    this.city.CityName = zone.LocalizedName;
    this.city.CountryName = zone.Country.LocalizedName;

    // Receiveing favorites list from session storage 
    this.cityList = JSON.parse(sessionStorage.getItem("favorites"));
    if (this.cityList === null) {
      this.cityList = [];
    }

    /* Checking if the required location is one of favorites, 
    in case it is favorite, change isFavorite boolean by addFavorite() */

    var key = this.city.Key;
    for (var i = 0; i < this.cityList.length; i++) {
      if (this.cityList[i].Key == key) {
        this.addFavorite();
        break;
      }
    }
  }


  /* Temperature Functions */

  /***************************************************************************************************
  * Function Name: checkTemperatureValue()
  * Input: event : any
  * Output: None
  * Function Operation: This function is inovked by checkbox slide button in Home html.
  * According to check option, receiving the temperature sign - F for fahrenheit and C for celsius.
  ****************************************************************************************************/
  checkTemperatureValue(event: any) {
    this.temperatureSign = event;
  }

  /* Utils Functions */
  
  /***************************************************************************************************
  * Function Name: onNoResults()
  * Input: None
  * Output: None
  * Function Operation: This function is inovked in case there is no data which received from API for  
  * the requested location. 
  ****************************************************************************************************/
  onNoResults() {
    this.responseString = "Failed, No Results";
    console.log(this.responseString);
  }

  /***************************************************************************************************
  * Function Name: ngOnDestroy()
  * Input: None
  * Output: None
  * Function Operation: This event function ngOnDestroy() used to unsubscribe from the Services which
  * have been used.
  ****************************************************************************************************/
  ngOnDestroy(): void {
    if (this.homeSubscription != null) {
      this.homeSubscription.unsubscribe();
    }
  }

}

