import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StatusPipe } from 'src/app/pipes/status.pipe';
import { DropdownPipe } from './../../../pipes/dropdown.pipe';

@NgModule({
  declarations: [StatusPipe, DropdownPipe],
  imports: [CommonModule],
  exports: [CommonModule, StatusPipe, DropdownPipe],
})
export class SharedModule {}
