import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IForecast } from '../Models/IForecast';
import { ICurrent } from '../Models/ICurrent';






@Injectable({
  providedIn: 'root'
})


/* 
    WeatherService enables to fetch data about weather from API.  
    This service will be used by components in project.

    In this service there are using in Observable:
    the Observable look on asynchronous operations in server.
    the Observable reports to Observer about any operation occurs. 
    In order that Observable will be able to update the Observer, the Observer need to subscribe to Observable. 
    So in function component, there is subscription to this Observable.
    When Observable report about asynchronous operation, it activate onNext* > activate method which receive data.  
    if error occur > Observable activate onError > activate method which handle this error. 
    if operation completed > Observable activate onCompleted. 

*/

export class WeatherService {

  private BASE_FORECAST_URL = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/";
  private BASE_CURRENT_URL = "http://dataservice.accuweather.com/currentconditions/v1/";

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  /* CTOR: Dependency Injection of HttpClient */
  constructor(private http: HttpClient) { }

  /***************************************************************************************************
   * Function Name: getCurrentWeather()
   * Input: locationKey: string
   * Output: Observable<ICurrent[]>
   * Function Operation: 
   * (1) Receiving location key from component which invoked the service.
   * (2) Generating the relevant url by the string which received.
   * (3) Returning Observable with array of the current objects which were fetched.
   * (4) In case of error, error is logged and there is error throwing to component.
  ****************************************************************************************************/
  getCurrentWeather(locationKey: string): Observable<ICurrent[]> {
    const url = `${this.BASE_CURRENT_URL}${locationKey}?apikey=QTQB9d5plA4cr00dPlMMQeDvmpqmWITa`
   
    return this.http.get<ICurrent[]>(url).pipe(
      catchError(
        (err: HttpErrorResponse) => {
          console.log(err)
          return throwError("error in http getCurrentWeather")
        }
      )
    )
  }

  /***************************************************************************************************
   * Function Name: getForecast()
   * Input: locationKey: string
   * Output: Observable<IForecast>
   * Function Operation: 
   * (1) Receiving location key from component which invoked the service.
   * (2) Generating the relevant url by the string which received.
   * (3) Returning Observable with array of the forecast objects which were fetched.
   * (4) In case of error, error is logged and there is error throwing to component.
  ****************************************************************************************************/
  getForecast(locationKey: string): Observable<IForecast> {
    const url = `${this.BASE_FORECAST_URL}${locationKey}?apikey=QTQB9d5plA4cr00dPlMMQeDvmpqmWITa`
    return this.http.get<IForecast>(url).pipe(
      catchError(
        (err: HttpErrorResponse) => {
          console.log(err)
          return throwError("error in http getForecast")
        }
      )
    )
  }




}