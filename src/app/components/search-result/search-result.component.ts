import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnInit {
  @Input()
  res!: any;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {}

  onClick(event: any): void {
    this.searchService.map!.googleMap!.setCenter(this.res.marker.getPosition());
  }

  onMouseEnter(event: any): void {
    const content = `
      <div id="content">
        <div id="sideNotice"></div>
        <h1 id="firstHeading" class="firstHeading">${this.res.name}</h1>
        <div id="bodyContent">
            You are <strong>${this.res.distance}</strong> kilometers away from this space. <br>
            This space is located in the '<strong>${this.res.neighborhood}</strong>' neighbourhood of Toronto. <br>
            This neighbourhood currently has <strong>${this.res.numCases}</strong> active cases of COVID-19.
            </ul>
        </div>
      </div>
    `
    this.searchService.infoWindow.setContent(content);
    this.searchService.infoWindow.open(this.searchService.map!.googleMap!, this.res.marker);
  }

  onMouseExit(event: any): void {
    this.searchService.infoWindow.close();
  }
}
