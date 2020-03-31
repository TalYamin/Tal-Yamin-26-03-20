import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Components/Home/home.component';
import { favoritesComponent } from './Components/Favorites/favorites.component';
import { ErrorComponent } from './Components/Error/error.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([

    {path: ' ', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'favorites', component:favoritesComponent},
    {path: 'error', component:ErrorComponent}

  ]
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
