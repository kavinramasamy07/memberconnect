import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import {Injectable, inject} from "@angular/core";
import {Auth} from "@angular/fire/auth";
import { from, Observable } from "rxjs";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { AuthService } from '../app/auth.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, DropdownModule, DialogModule, CommonModule,  ReactiveFormsModule, InputTextModule, CardModule, ButtonModule, ToastModule],
  providers:[MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public email:string="";
  public password:string="";
  authService = inject(AuthService);
  loginForm: FormGroup;
  chapters: any[];
  router = inject(Router)
  errorMessage: string | null = null;
  showForgotPassword =false;
  constructor(private fb: FormBuilder, private _messageService: MessageService ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      chapter: ['', Validators.required]
    });

    this.chapters = [
      { label: 'Atlanta', value: 'Atlanta' },
      { label: 'Berlin', value: 'Berlin' },
      { label: 'Boston', value: 'Boston' },
      { label: 'Canada', value: 'Canada' },
      { label: 'Chicago', value: 'Chicago' },
      { label: 'Honolulu', value: 'Honolulu' },
      { label: 'New York', value: 'NewYork' },
      { label: 'San Francisco', value: 'SanFrancisco' },
      { label: 'Virtual', value: 'Virtual' },
    ];
  }


  public selectedChapter: string="";

  public btnLoginClick() : void{
      this.email="buttonClicked";
  }

  ngOnInit(): void {}

  onSubmit(): void {
    const rawForm = this.loginForm.getRawValue();
    this.authService
      .login(rawForm.email, rawForm.password, rawForm.chapter)
      .subscribe({
        next:() => {
          this.router.navigateByUrl('/events');
        },
        error: (err) =>{
          this._messageService.add({key:'toastKey', severity: 'error', summary: 'Login Error', detail:'Invalid Email/Password', sticky:true });
          this.errorMessage = err.code
        }
      })
  }

  onForgotPassword(){
      this.showForgotPassword=!this.showForgotPassword;
  }

  onReset() {
    this.loginForm.reset();
  }
}
