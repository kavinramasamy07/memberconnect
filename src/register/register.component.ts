import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, DropdownModule,   ReactiveFormsModule, InputTextModule, CardModule, ButtonModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  chapters: any[];
  gradYears: string[];
  selectedGradYear: string;
  selectedChapter: string;
  firebaseId: string;
  invitedId: string;
  httpClient = inject(HttpClient);
  router = inject(Router);

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      fName: ['', [Validators.required]],
      lName: ['', Validators.required],
      school:['', Validators.required ],
      gradYear:['', [Validators.required]],
      email:['', [Validators.required, Validators.email]],
      chapter:['', Validators.required ]
    });
    this.chapters = [
    
      { label: 'Boston', value: 'Boston' },
      { label: 'Chicago', value: 'Chicago' },
      { label: 'New York', value: 'NewYork' },
      { label: 'San Franscisco', value: 'SanFranscisco' },
    ];
    this.selectedGradYear="";
    this.selectedChapter="";
    this.firebaseId="";
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
     
      this.selectedGradYear=params['gradYear'];
      this.selectedChapter=params['chapter'];
      this.firebaseId=params['id'];
      this.invitedId=params['inviteid'];
     
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
  get school() {
    return this.registerForm.get('school')?.value;
  }
  get chapter() {
    return this.registerForm.get('chapter')?.value;
  }
  get gradYear() {
    return this.registerForm.get('gradYear')?.value;
  }
  
  onSubmit(): void {
  
    if (this.registerForm.valid) {
      this.register();
      
    } else {
      console.log('Form is invalid');
    }
   
  }

  register() {
    console.log('Form Submitted', this.registerForm.value);
    const token= localStorage.getItem('tokenId');
    const chapter = localStorage.getItem('chapter');
    var baseUrl="https://api.junioreconomicclub.org";
    var qsp =  `email=${this.email}&firstName=${this.fName}&lastName=${this.lName}&school=${this.school}&gradYear=${this.gradYear}&gender=&id=${this.firebaseId}&chapter=${this.chapter}`;
 
    var url = baseUrl+ "/auth/registerNewUser?"+qsp;
    this.httpClient.get(url)
    .subscribe((e: any) => {
        this.router.navigateByUrl('/events');
    });
  }

  onReset() {
    this.registerForm.reset();
  }
}
