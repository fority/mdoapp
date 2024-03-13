import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idToName',
})
export class DropdownPipe implements PipeTransform {
  transform(id: string, data: any[]): string {
    const item = data.find((item) => item.value === id);
    return item ? item.label : '';
  }
}
