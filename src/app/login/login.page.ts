import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formValidation: FormGroup; 
  errorMessage: string = ''; 

  formValidationMessages = { 
   'email': [
     { type: 'required', message: 'El email es un campo obligatorio.' },
     { type: 'pattern', message: 'El formato del email no es correcto.' }
   ],
   'password': [
     { type: 'required', message: 'La contraseña es un campo obligatorio.' },
     { type: 'minlength', message: 'La lóngitud mínima de una contraseña es 6 caracteres.' }
   ]
 };

  constructor(
    private authService: AuthService, 
    private formBuilder: FormBuilder, 
    private router: Router 
  ) { }

  ngOnInit() {
    this.formValidation = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }

  tryLogin(value){ 
    this.authService.doLogin(value)
    .then(res => {
      this.router.navigate(["/products"]);
    }, err => {
      this.errorMessage = err.message;
      if(err.message.includes('(auth/user-not-found)'))
        this.errorMessage = "El email que escribió es incorrecto. Inténtelo nuevamente.";
      if(err.message.includes('(auth/wrong-password)'))    
        this.errorMessage = "La contraseña que ha proporcionado no es correcta. Inténtelo de nuevo.";
      console.log(err);
    })
  }
}