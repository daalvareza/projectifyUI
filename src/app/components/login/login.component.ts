import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  error: String = "";
  message: String = "";

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.createForm();
  }

  /* Method to create the form, it sets the username and password as empty strings initially,
   and they are both required fields */
  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /* When the form is submitted, check if it's valid. If it is, extract the username and password 
    and call the login method from the login service. This method returns an observable, so we subscribe to it. */
  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.loginService.login(username, password).subscribe({
        next: response => {
          // On successful login, save the JWT to local storage and navigate to the projects page.
          localStorage.setItem('jwt', response.token);
          this.router.navigate(['/projects']);
        },
        error: error => {
          // If there's an error, show it.
          this.error = error.error.error;
          this.message = "";
        }
      });
    }
  }

  // Similar to onSubmit, but this time it's for registering a new user.
  onRegister() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.loginService.register(username, password).subscribe(
        response => {
          // Log the response on successful registration
          this.message = "Registration successfull";
          this.error = "";
        },
        error => {
          // If there's an error, show it.
          this.error = error.error.error;
        }
      );
    }
  }
}