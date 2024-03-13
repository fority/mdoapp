import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterExternalComponent } from '../../components/footer-layout/footer-external/footer-external.component';
import { HeaderExternalComponent } from '../../components/header-layout/header-external/header-external.component';

@Component({
  standalone: true,
  imports: [HeaderExternalComponent, FooterExternalComponent, RouterModule],
  selector: 'app-guest-layout',
  templateUrl: './guest-layout.component.html',
  styleUrls: ['./guest-layout.component.css']
})
export class GuestLayoutComponent {

}
