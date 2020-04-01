import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/Home/home.component';
import { favoritesComponent } from './Components/Favorites/favorites.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemperatureConverterPipe } from './Pipes/TemperatureConverterPipe';
import { FavoriteFilterPipe } from './Pipes/FavoriteFilterPipe';
import { ErrorComponent } from './Components/Error/error.component';
import { SpinnerComponent } from './Components/Spinner/spinner.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    favoritesComponent,
    ErrorComponent,
    SpinnerComponent,
    TemperatureConverterPipe,
    FavoriteFilterPipe
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
