import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectOption } from '../models/sharedModels';

const downloadFile = (
  data: any,
  fileName: string
): { url: string; download: string } => {
  let downloadURL = window.URL.createObjectURL(data);
  let link = document.createElement('a');
  link.href = downloadURL;

  link.download = fileName;
  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
  );
  //link.click();

  return { url: downloadURL, download: fileName };
};

const readFile = (file: File): Observable<string> => {
  return new Observable((obs) => {
    const reader = new FileReader();
    reader.onload = () => {
      obs.next(reader.result as string);
      obs.complete();
    };
    reader.readAsDataURL(file);
  });
};

function ArrayToSelection<T = string>(
  _array: any,
  column: string[]
): SelectOption<T>[] {
  // const list = map(_array, (value) => pick(value, column));
  const selection = [] as SelectOption<T>[];
  _array.forEach((data: any) => {
    if (data[column[0]] && data[column[1]])
      selection.push({ label: data[column[0]], value: data[column[1]] as T });
  });
  return selection;
}

function validateForm(formGroup: FormGroup) {
  // console.log(formGroup);
  for (const i in formGroup.controls) {
    // console.log(i);
    if (formGroup.controls.hasOwnProperty(i)) {
      formGroup.controls[i].markAsDirty();
      formGroup.controls[i].updateValueAndValidity({ onlySelf: true });
    }
  }
  //* If Form is Invalid return false (Form wrong) else true (Form correct)
  return !formGroup.invalid;
}



export const isNullOrEmpty = (str: string | null | undefined): boolean => {
  return str === null || str === undefined || str.trim() === '';
}

function validateInvalidField(formGroup: FormGroup) {
  let fieldList = new Set<string>();
  for (const i in formGroup.controls) {
    if (formGroup.controls.hasOwnProperty(i)) {
      formGroup.controls[i].markAsDirty();
      formGroup.controls[i].updateValueAndValidity({ onlySelf: true });
    }
    if (formGroup.controls[i].invalid) {
      fieldList.add(i);
    }
  }
  return fieldList;
}

function getFormData(object: any, _formData: FormData): FormData {
  return Object.keys(object).reduce((_formData, key) => {
    if (object[key] !== null && object[key] !== undefined) {
      _formData.append(key, object[key]);
      // _formData.append(key, object[key] == null ? '' : object[key]);
    }
    return _formData;
  }, _formData);
}

export {
  downloadFile as DownloadFile,
  getFormData as GenerateFormData,
  ArrayToSelection as GetArraySelection,
  readFile as ReadFile,
  validateForm as ValidateForm,
  validateInvalidField as ValidateInvalidField
};



// // check if an object matches an interface, recursively.
// export function isValid(object: any, interfaceObj: CarBrandDto): boolean {

//   if (interfaceObj.) { // members may be undefined if there are no members.
//     for (let member of interfaceObj.members) {
//       if (isPrimitive(member.type) && object[member.name] && member.type.kind != typeof object[member.name]) {
//         // found a primitive type field in the interface, but not in the object
//         console.log(`Field ${member.name} should be ${member.type.kind} but it is ${typeof object[member.name]}`)
//         return false;
//       } else if (member.type.kind === 'interface' && object[member.name]) {
//         // recursively check field type against the corresponding interface
//         if (!isValid(object[member.name], <CarBrandDto>member.type)) {
//           return false;
//         }
//       }
//       // TODO: check class types...
//     }
//   }
//   return true;
// }

// function isPrimitive(type: Type): boolean {
//   return type && (
//     type.kind === "string" ||
//     type.kind === "number" ||
//     type.kind === "boolean"
//   );
// }

export const ValidateAllFormFields = (formGroup: FormGroup) => {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      ValidateAllFormFields(control);
    }
  });
}

export const FileToBase64 = (file: File): Observable<string> => {
  return new Observable((obs) => {
    const reader = new FileReader();
    reader.onload = () => {
      obs.next(reader.result as string);
      obs.complete();
    };
    reader.readAsDataURL(file);
  });
};
