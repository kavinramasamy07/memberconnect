import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore'
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { Auth } from 'firebase/auth';
import { AuthService } from './auth.service';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { firebaseConfig } from './app.config';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'memberConnect';
  private firestore: FirebaseTSFirestore | undefined;
  private dataRef: any;
  public displayName: any;
  showHead: boolean = false;
  private authService = inject(AuthService);

  
  constructor (private router: Router) {
   
    this.displayName='';
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url===('/') || event.url.includes('/login') || event.url.includes('/register')) {
          this.showHead= false;
        } else {
          this.showHead= true;
        }
      }
    });
  }

  ngOnInit(): void {
    FirebaseTSApp.init(firebaseConfig);
    this.firestore = new FirebaseTSFirestore();
    this.firestore.getDocument({
      path: ["members", (localStorage.getItem('userId')??"")],
      onComplete: (result: any) => {
        this.dataRef = result.data();
        this.displayName = this.dataRef.firstName;
      }
    } );
}
}

