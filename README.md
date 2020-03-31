# Weather App Task

This app is used to show the weather of some locations.
User can search a location and to watch the current weather and 5 days forecast.
In addition, User can save location as a favorite and to access their weather information easily. 


## App architecture and features

- App-root

  - Home component (Routing)
    features:
    * Search input with autocomplete locations from API.
    * Current weather panel.
    * Forecast weather panel.
    * Add/Remove Favorite button.
    * Indication sign to favorite location.
    * Checkbox slide for temperature type : Fahrenheit or Celsius.
    
  - Favorites component (Routing)
    features:
    * Responsive favorites table.
    * Filter input to search for specific favorite.
    * Show Forecast button by favorite location.
    * Remove Favorite button.
    * Checkbox slide for temperature type : Fahrenheit or Celsius.
  
  - Error component (Routing)  
     features:
    * Used in case there is server error (usually when passing the limited API requests)
    * Toasting message with relevant error
      
### Services

* Location Service - handles HTTP requests to fetch locations infroamtion from API.
* Weather Service - handles HTTP requests to fetch weather infroamtion from API.

Services implement Observing an Observable Design Pattern from RxJS library. 

### Custom Pipes

* TemperatureConverterPipe - used to convert temperature type, Fahrenheit or Celsius.
* FavoriteFilterPipe - used to filter favorites list according to search string.

### Models
 
 Using json2ts tool in order to work with custom models according to API's json. 

### Stack Information

* Angular 
* Bootstrap - UI library 
* RxJS

### External Api

Using Accuweather API in order to fetch weather infromation according location.

NOTE: this API is limited to 50 requests per day.
