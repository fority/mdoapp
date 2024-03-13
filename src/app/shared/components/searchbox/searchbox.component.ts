import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { Observable, map, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, AutoCompleteModule],
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css'],
})
export class SearchboxComponent {
  @Input() AutoCompleteSource$: Observable<string[]> = of([]);
  @Input() PlaceHolder: string = '';
  @Output() onSearch = new EventEmitter();
  @Output() onClearClick = new EventEmitter();
  FilteredAutoComplete$: Observable<string[]> = of([]);
  SearchTextNgModel = signal(undefined);
  SearchTextNgModel$ = toObservable(this.SearchTextNgModel);
  @ViewChild('searchInput') searchInput: AutoComplete | undefined;

  clearingSearch: boolean = false;

  constructor() {
    this.SearchTextNgModel$.pipe().subscribe((x) => {
      if (typeof x === 'string') this.onSearch.emit(x);
    });
  }

  OnSelect() {
    this.Search();
  }

  EnterKeyPress() {
    this.Search();
  }

  AutoComplete(event: AutoCompleteCompleteEvent) {
    this.FilteredAutoComplete$ = this.AutoCompleteSource$.pipe(
      map((result) => result.filter((res) => res.toLowerCase().includes(event.query.toLowerCase())))
    );
  }

  ClearSearch = () => {
    if (!this.clearingSearch) {
      this.clearingSearch = true;

      if (this.searchInput) {
        this.searchInput.clear();
      }

      this.onClearClick.emit();

      // Reset the flag after a short delay
      setTimeout(() => {
        this.clearingSearch = false;
      }, 0);
    }
  };

  Search() {
    this.SearchTextNgModel.set(this.searchInput?.inputEL?.nativeElement.value);
  }

  Focus() {
    this.AutoCompleteSource$.subscribe((res) => (this.AutoCompleteSource$ = of(res)));
  }
}
