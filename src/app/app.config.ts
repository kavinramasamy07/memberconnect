import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {AngularFireModule } from '@angular/fire/compat'
import {provideFirebaseApp, initializeApp} from '@angular/fire/app'
import { getAuth, provideAuth } from '@angular/fire/auth'
import { provideHttpClient } from '@angular/common/http';

export const firebaseConfig = {
  apiKey: "AIzaSyBMr8uffjSDi6wdDkqMc9vnb-HoQm5ENeM",
  authDomain: "jec-connect.firebaseapp.com",
  projectId: "jec-connect",
  storageBucket: "jec-connect.appspot.com",
  messagingSenderId: "993305911857",
  appId: "1:993305911857:web:99646631db361ddf3eab10",
  measurementId: "G-MQ44VY39GY"
  // apiKey: "AIzaSyAkzxAubywlsgHP_DVRBiHuzEAO9Kaum2M",
  // authDomain: "connectngtest.firebaseapp.com",
  // projectId: "connectngtest",
  // storageBucket: "connectngtest.appspot.com",
  // messagingSenderId: "61270396850",
  // appId: "1:61270396850:web:e12720a08dbd0997da1eab"
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()) 
  ]
};
