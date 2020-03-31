import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { ILocation } from '../Models/ILocation';


@Injectable({
    providedIn: 'root'
})

/* 
    LocationService enables to fetch data about locations from API.  
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
export class LocationService {

    private BASE_LOCATION_URL = "http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=QTQB9d5plA4cr00dPlMMQeDvmpqmWITa&q=";


    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    /* CTOR: Dependency Injection of HttpClient */
    constructor(private http: HttpClient) { }

    /***************************************************************************************************
     * Function Name: getLocations()
     * Input: searchString: string
     * Output: Observable<ILocation[]> 
     * Function Operation: 
     * (1) Receiving search string from component which invoked the service.
     * (2) Generating the relevant url by the string which received.
     * (3) Returning Observable with array of the location which were fetched.
     * (4) In case of error, error is logged and there is error throwing to component.
    ****************************************************************************************************/
    getLocations(searchString: string): Observable<ILocation[]> {
        const url = `${this.BASE_LOCATION_URL}${searchString}`
        return this.http.get<ILocation[]>(url).pipe(
            catchError(
                (err: HttpErrorResponse) => {
                    console.log(err)
                    return throwError("error in http getLocations")
                }
            )
        )
    }


}