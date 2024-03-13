import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StatusPipe } from 'src/app/pipes/status.pipe';

@NgModule({
  declarations: [StatusPipe],
  imports: [CommonModule],
  exports: [CommonModule, StatusPipe],
})
export class SharedModule {}
