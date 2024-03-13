import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusPipe',
})
export class StatusPipe implements PipeTransform {
  transform(data: number | null) {
    switch (data) {
      case 0: {
        return 'NONE';
      }
      case 10: {
        return 'POSTED';
      }
      case 20: {
        return 'RETURNED';
      }
      case 90: {
        return 'CANCELED';
      }

      default: {
        return '';
      }
    }
  }
}
