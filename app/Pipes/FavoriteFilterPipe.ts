import {Pipe, PipeTransform} from '@angular/core';
import { IFavorite } from '../Models/IFavorite';

@Pipe ({
    name: 'FavoriteFilterPipe'
})

/* 
    Custom pipe which used to convert filter favorites list according to city name.
    It receives favorites array, and filter string. according to the string value, 
    it filter the array and return only the relevant favorites.
*/
export class FavoriteFilterPipe implements PipeTransform {

    transform(value: IFavorite[], filterBy: string) : IFavorite[] {

        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;

        return filterBy ? value.filter((favorite:IFavorite) =>
        favorite.CityName.toLocaleLowerCase().indexOf(filterBy) !== -1) : value; 

    }

}