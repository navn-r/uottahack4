import { Injectable } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { BehaviorSubject } from 'rxjs';
import data from '../../assets/data.json';
/**
 * https://stackoverflow.com/questions/20074747/check-if-a-point-is-inside-a-polygon-with-the-google-maps-api/20077135
 */
const TORONTO_BOUNDS = new google.maps.LatLngBounds(
  new google.maps.LatLng(43.5350495, -79.5415775),
  new google.maps.LatLng(43.8637018, -79.1471317)
);

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  map: GoogleMap | null = null;
  geocoder: google.maps.Geocoder = new google.maps.Geocoder();
  polygons: google.maps.Polygon[];

  searchResult = new BehaviorSubject<any>(null);

  constructor() {
    this.polygons = data.features.map((feature) => {
      const coordinates = feature.geometry.coordinates.map((co) =>
        co.map(([lng, lat]) => {
          return { lat, lng };
        })
      );
      return new google.maps.Polygon({ paths: coordinates });
    });
  }

  normalizeColors(searchResults: any[]): any[] {
    let min = 266, max = 0;
    searchResults.forEach(({numCases}) => {
      if(numCases < min) min = numCases;
      if(numCases > max) max = numCases;
    });
    return searchResults.map((r, i) => {
      let shade = 1 - ((r.numCases - min) / (max - min));
      return {...r, color: `rgb(${shade * 60}, ${shade * 138}, ${shade * 45})` }
    });
  }

  setMap(map: GoogleMap): void {
    this.map = map;
  }

  searchPlaces(position: any, query: string): void {
    if (!this.map || !this.map.googleMap) return;

    const prevVal = this.searchResult.getValue();
    if (!!prevVal)
      prevVal.forEach((v: any) =>
        (v.marker as google.maps.Marker).setMap(null)
      );

    const { longitude, latitude } = position.coords;
    const service = new google.maps.places.PlacesService(this.map.googleMap);
    service.nearbySearch(
      {
        keyword: query,
        location: new google.maps.LatLng(latitude, longitude),
        radius: 10000,
      },
      (req, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          this.searchResult.next(
            req
              .map((r: google.maps.places.PlaceResult) => {
                const result = {
                  placeId: r.place_id,
                  location: r.geometry!.location,
                  name: r.name,
                  address: r.vicinity,
                } as any;
                this.polygons.forEach((polygon, i) => {
                  if (
                    google.maps.geometry.poly.containsLocation(
                      result.location,
                      polygon
                    )
                  ) {
                    result.neighborhood = data.features[i].properties.name;
                    result.numCases = data.features[i].properties.numCases;
                  }
                });
                return result;
              })
              .filter((res, index, self) => {
                if (!res.neighborhood) return false;
                for (let i = 0; i < index; i++) {
                  if (self[i].address.includes(res.address.split(',')[0]))
                    return false;
                }
                return true;
              })
              .sort((a, b) => a.numCases - b.numCases)
              .map((f) => {
                return {
                  ...f,
                  marker: new google.maps.Marker({
                    position: f.location,
                    map: this.map!.googleMap,
                  }),
                };
              })
          );
        }
      }
    );
  }
}
