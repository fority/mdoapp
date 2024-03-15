import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(url);
  link.remove();
};

export function DownloadFile(data: any, fileName: string): { url: string; download: string } {
  let downloadURL = window.URL.createObjectURL(data);
  let link = document.createElement('a');
  link.href = downloadURL;
  link.download = fileName;
  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

  return { url: downloadURL, download: fileName };
};

export function ReadFile(file: File): Observable<string> {
  return new Observable((obs) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      obs.next(reader.result as string);
      obs.complete();
    };
    reader.readAsDataURL(file);
  });
};

export function ValidateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      ValidateAllFormFields(control);
    }
  });
}

export function FileToBase64(file: File): Observable<string> {
  return new Observable((obs) => {
    const reader = new FileReader();
    reader.onload = () => {
      obs.next(reader.result as string);
      obs.complete();
    };
    reader.readAsDataURL(file);
  });
};

export function isNullOrEmpty(str: string | null | undefined): boolean {
  return str === null || str === undefined || str.trim() === '';
}
