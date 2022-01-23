import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  checkoutForm = this.formBuilder.group({
      account: new FormControl('', [
        Validators.required,
        Validators.minLength(4) // <-- Here's how you pass in the custom validator.
      ]),
      password: ['', Validators.minLength(6)],
      confirm_password: new FormControl('',
        [Validators.minLength(6)])
    },
    {
      validator: this.confirmedValidator('password', 'confirm_password')
    });

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // Process checkout data here
    console.warn('Your order has been submitted', this.checkoutForm.value);
    // this.checkoutForm.reset();
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({confirmedValidator: true});
      } else {
        matchingControl.setErrors(null);
      }
    }


  }
}
