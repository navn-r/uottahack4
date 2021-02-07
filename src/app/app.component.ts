import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  title = "Where's the safest space?";

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  private ngUnsubscribe = new Subject();

  searchResults: any[] = [];

  constructor(
    private searchService: SearchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.map.data.loadGeoJson('assets/data.json');
    this.map.data.setStyle((feature) => {
      return {
        fillOpacity: feature.getProperty('fillOpacity'),
        strokeWeight: 0.1,
        fillColor: '#FF0000',
      };
    });

    this.map.data.addListener('mouseover', (event: any) => {
      this.map.data.revertStyle();
      this.map.data.overrideStyle(event.feature, {
        strokeWeight: 0.7,
        fillOpacity: event.feature.getProperty('fillOpacity') + 0.1,
      });
      const getNumber = (s: string): string => {
        const u = s[s.length - 1];
        if (u === '1') return s + 'st';
        if (u === '2') return s + 'nd';
        if (u === '3') return s + 'rd';
        return s + 'th';
      };
      const content = `
      <div id="content">
        <div id="sideNotice"></div>
        <h1 id="firstHeading" class="firstHeading">${event.feature.getProperty(
          'name'
        )}</h1>
        <div id="bodyContent">
          This neighbourhood is in the <strong>${getNumber(
            event.feature.getProperty('percentile').toFixed(0)
          )}</strong> percentile with <strong>${event.feature.getProperty('numCases')}</strong> active cases of COVID-19.
        </div>
      </div>
      `;
      const pos = new google.maps.MVCObject();
      pos.set(
        'position',
        new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())
      );
      this.searchService.neighborhoodWindow.setContent(content);
      this.searchService.neighborhoodWindow.open(
        this.searchService.map!.googleMap!,
        pos
      );
    });

    this.map.data.addListener('mouseout', (event: any) => {
      this.map.data.revertStyle();
      this.searchService.neighborhoodWindow.close();
    });

    this.searchService.setMap(this.map);
  }

  ngOnInit() {
    this.searchService.searchResult
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.searchResults =
          !!res && res.length ? this.searchService.normalizeColors(res) : [];
        this.cdr.detectChanges();
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
    navigator.geolocation.getCurrentPosition((position) =>
      this.searchService.searchPlaces(position, event)
    );
  }
}
