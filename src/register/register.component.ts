import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { createUserWithEmailAndPassword, User } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { RadioButtonModule } from 'primeng/radiobutton';
import { getFirestore, doc, setDoc, setLogLevel } from 'firebase/firestore';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, DropdownModule, RadioButtonModule,     ReactiveFormsModule, InputTextModule, CardModule, ButtonModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  chapters: any[];
  gradYears: string[];
  selectedGradYear: string;
  selectedChapter: string;
  invitedId: string;
  httpClient = inject(HttpClient);
  router = inject(Router);
  registrationError: string |null =null;
  inviteIdExists = false; 

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private auth: Auth) {
    this.registerForm = this.fb.group({
      fName: ['', [Validators.required]],
      lName: ['', Validators.required],
      school:['', Validators.required ],
      gradYear:['', [Validators.required]],
      gender: ['Male', [Validators.required]],
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required, Validators.minLength(6)]],
      confirmPassword:['', [Validators.required, Validators.minLength(6)]],
      chapter:['', Validators.required ]
    },
    {
      validators: this.passwordMatchValidator
    });
     this.chapters = [
    
      { label: 'Atlanta', value: 'Atlanta' },
      { label: 'Berlin', value: 'Berlin' },
      { label: 'Boston', value: 'Boston' },
      { label: 'Canada', value: 'Canada' },
      { label: 'Chicago', value: 'Chicago' },
      { label: 'Honolulu', value: 'Honolulu' },
      { label: 'New York', value: 'New York' },
      { label: 'San Francisco', value: 'San Francisco' },
      { label: 'Virtual', value: 'Virtual' },
      
    ];
    this.selectedGradYear="";
    this.selectedChapter="";
    this.invitedId="";
    const currentYear = new Date().getFullYear();
    this.gradYears = Array.from({ length: 4 }, (_, i) => (currentYear + i + 1).toString());
  }
  ngOnInit() {
      this.route.queryParams.subscribe(params => {
      this.registerForm.controls['fName'].setValue(params['fName']);
      this.registerForm.controls['lName'].setValue(params['lName']);
      this.registerForm.controls['school'].setValue(params['school']);
      this.registerForm.controls['gradYear'].setValue(params['gradYear']);
      this.registerForm.controls['email'].setValue(params['email']);
      this.registerForm.controls['chapter'].setValue(params['chapter']);
      this.registerForm.controls['password'].setValue(params['password']);
      this.registerForm.controls['confirmPassword'].setValue(params['confirmPassword']);
      this.registerForm.controls['chapter'].setValue(params['chapter']);
      this.selectedGradYear=params['gradYear'];
      this.selectedChapter=params['chapter'];
      this.invitedId=params['id'];

      this.route.queryParams.subscribe((params) => {
        // Check if the specific query parameter exists
        this.inviteIdExists = !!params['id']; 
      });
     
    });
  }
  get fName() {
    return this.registerForm.get('fName')?.value;
  }
  get lName() {
    return this.registerForm.get('lName')?.value;
  }
  get email() {
    return this.registerForm.get('email')?.value;
  }
  get password() {
    return this.registerForm.get('password')?.value;
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword')?.value;
  }
  get school() {
    return this.registerForm.get('school')?.value;
  }
  get chapter() {
    return this.registerForm.get('chapter')?.value;
  }
  get gradYear() {
    return this.registerForm.get('gradYear')?.value;
  }
  get gender() {
    return this.registerForm.get('gender')?.value;
  }
  
  passwordMatchValidator(control: AbstractControl) {
       return control?.get('password')?.value === control?.get('confirmPassword')?.value ? null : { mismatch:true }
  };


  onSubmit(): void {
  
    if (this.registerForm.valid) {
      this.register();
      
    } else {
      console.log('Form is invalid');
    }
   
  }

  register() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password) .then(async (userCred) => {
      var res= await userCred.user.getIdTokenResult(true);
      localStorage.setItem('userId', res.claims.sub?.toString()??"")
      localStorage.setItem('tokenId', res.token);
      localStorage.setItem('chapter', this.chapter);
      const token= localStorage.getItem('tokenId');
      var userId = localStorage.getItem('userId');
      
      var baseUrl="https://api.junioreconomicclub.org";
      var qsp =  `s=${this.invitedId}&email=${this.email}&fname=${this.fName}&lname=${this.lName}&school=${this.school}&gradYear=${this.gradYear}&gender=${this.gender}&id=${userId}&chapter=${this.chapter}&key=${token}`;
      var url = baseUrl+ "/auth/registerNewUser/web?"+qsp;
      this.httpClient.get(url , { responseType: 'text' })
      .subscribe({
        next: () => {
          //add the user to Firestore
          const db = getFirestore();
          setDoc(doc(db, "members", userId!), {
           member: userId!,
           chapter:this.chapter,
           firstName:this.fName,
           lastName:this.lName,
           email:this.email,
           gender:this.gender,
           gradYear:this.gradYear,
           school: this.school,
           joinYear: 2025
           
         })
         .then(() =>  this.router.navigateByUrl('/events'))
         .catch(error => this.registrationError= error);
          
        },
        error: (err) =>{
            this.registrationError= err;
        }
      })
     
    })
    .catch((error) => {
      this.registrationError= error;
    });;
 
  }

  onReset() {
    this.registerForm.reset();
  }

  signUp(name: string, email: string, password: string )
  {
    
   
  }
}


