import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-footer-external',
  templateUrl: './footer-external.component.html',
  styleUrls: ['./footer-external.component.less'],
})
export class FooterExternalComponent {}
