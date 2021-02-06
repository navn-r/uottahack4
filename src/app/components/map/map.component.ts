import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('map') map!: google.maps.Map;

  constructor() { }

  ngAfterViewInit(): void {
    this.map.data.loadGeoJson('../../../assets/data.json');
    this.map.data.setStyle((feature) => {
      return {
        fillOpacity: feature.getProperty('fillOpacity'),
      }
    });

// map.data.addListener('mouseover', function(event) {
//   document.getElementById('info-box').textContent =
//       event.feature.getProperty('name') + event.feature.getProperty('numCases');
// });
  }

  ngOnInit(): void {
  }

  options: google.maps.MapOptions = {
    center: {lat: 43.7227, lng: -79.374697},
    zoom: 12,
  };
}
