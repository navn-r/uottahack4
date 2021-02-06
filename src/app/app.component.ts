import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { SearchService } from './services/search.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

/**
 * https://timdeschryver.dev/blog/google-maps-as-an-angular-component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  title = "Where's the Safest Space?";

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  text: string = '';
  
  private ngUnsubscribe = new Subject();

  searchResults: any[] = [];

  constructor(private searchService: SearchService) {}

  ngAfterViewInit(): void {
    this.map.data.loadGeoJson('../assets/data.json');
    this.map.data.setStyle((feature) => {
      return {
        fillOpacity: feature.getProperty('fillOpacity'),
        strokeWeight: 0.1,
        fillColor: '#FF0000',
      };
    });

    this.map.data.addListener('click', (event: any) => {
      this.text = `${event.feature.getProperty('name')}: ${event.feature.getProperty('numCases')}`;
    });
    
    this.searchService.setMap(this.map);
  }

  ngOnInit() {
    this.searchService.searchResult.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.searchResults = !!res && res.length ? res : [];
      console.table(this.searchResults);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  options: google.maps.MapOptions = {
    center: { lat: 43.7227, lng: -79.374697 },
    zoom: 12,
  };

  onSearch(event: any) {
    navigator.geolocation.getCurrentPosition((position) => this.searchService.searchPlaces(position, event));
  }
}
