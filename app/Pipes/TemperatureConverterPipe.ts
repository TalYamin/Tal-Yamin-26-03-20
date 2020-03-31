import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'temperatureConverter'
})

/* 
  Custom pipe which used to convert temperature type according the sign which received.
  'F' for fahrenheit  and 'C' for celsius.
  In case of 'F', same value which received, return to user.
  In case of 'C', there is calculation to celsius, and return to user.
*/
export class TemperatureConverterPipe implements PipeTransform {

  transform(value: number, unit: string) {
          if(value && !isNaN(value)){
                  
                 if(unit === 'C'){
                   var tempareature = (value - 32) / 1.8 ;
                   return tempareature.toFixed(2);
                 }
                 if(unit === 'F'){
                  return value;
                }
          }
    return;
  }

}