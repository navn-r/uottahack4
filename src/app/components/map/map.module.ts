import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';

@NgModule({
  declarations: [
    MapComponent,
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
  ],
  exports: [
    MapComponent,
  ],
})
export class MapModule {}