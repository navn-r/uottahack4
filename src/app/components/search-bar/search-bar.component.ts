import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  searchQuery: string = '';

  @Output()
  searchEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  search() {
    if (this.searchQuery !== '') {
      this.searchEvent.emit(this.searchQuery);
    }
  }
}
