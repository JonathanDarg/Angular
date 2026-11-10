import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// A validator is just a function: it receives a control and returns
//   null              → the value is valid
//   { someKey: ... }  → the value is invalid; the key becomes the error name
// Angular merges these objects into control.errors, and control.hasError('someKey') checks for one.

// 1) A validator FACTORY: a function that takes a setting and RETURNS a validator.
//    Use it like: forbiddenWord('admin')
export function forbiddenWord(word: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').toLowerCase();
    return value.includes(word.toLowerCase()) ? { forbiddenWord: { word } } : null;
  };
}

// 2) A plain validator (no settings). Checks for at least one capital letter and one number.
//    Returning details (which rules failed) lets the template show helpful messages.
export const strongPassword: ValidatorFn = (control) => {
  const value = String(control.value ?? '');
  if (!value) return null; // let `required` handle empty values
  const missingUppercase = !/[A-Z]/.test(value);
  const missingNumber = !/[0-9]/.test(value);
  return missingUppercase || missingNumber ? { strongPassword: { missingUppercase, missingNumber } } : null;
};

// 3) A CROSS-FIELD validator: it goes on the FormGroup, not a single control,
//    because it needs to compare two fields. The error lands on the group.
export const passwordsMatch: ValidatorFn = (group) => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordsMismatch: true } : null;
};
