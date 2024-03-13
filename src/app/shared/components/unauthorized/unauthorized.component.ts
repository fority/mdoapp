import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedComponent {
  constructor(private location: Location, private router: Router) {}

  BackClick() {
    this.location.back();
  }

  HomeClick() {
    this.router.navigate(['/']);
  }
}
