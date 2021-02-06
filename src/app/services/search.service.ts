import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  findPlaceFromText(stuff: string): Promise<any> {
    return this.http.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/JSON?${stuff}`).toPromise();
  }
}




// function addMarker(location, map) {
//   // Add the marker at the clicked location, and add the next-available label
//   // from the array of alphabetical characters.
//   new google.maps.Marker({
//     position: location,
//     label: labels[labelIndex++ % labels.length],
//     map: map,
//   });

//GET https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={longtitude},{latitude}&radius=25000&keyword={query}&key=AIzaSyDEtpf8IjzQPvaBfnp8SX_WgFUVOqoOhuA&
// data field is "geometry":"location":"lat/long"