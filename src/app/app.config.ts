import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { LogLevel, provideAuth } from 'angular-auth-oidc-client';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';

// Firebase is retained ONLY for Analytics (and, optionally, App Check).
// Authentication and Firestore have been replaced by Amazon Cognito and the
// JEC backend API respectively.
export const firebaseConfig = {
  apiKey: 'AIzaSyBMr8uffjSDi6wdDkqMc9vnb-HoQm5ENeM',
  authDomain: 'jec-connect.firebaseapp.com',
  projectId: 'jec-connect',
  storageBucket: 'jec-connect.appspot.com',
  messagingSenderId: '993305911857',
  appId: '1:993305911857:web:99646631db361ddf3eab10',
  measurementId: 'G-MQ44VY39GY',
};

// Amazon Cognito (OIDC Authorization Code + PKCE via Hosted UI).
// The OIDC discovery document for this user pool already points the
// authorize/token/logout endpoints at the custom domain
// (login.junioreconomicclub.org), so `authority` alone is sufficient.
export const cognitoConfig = {
  authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_eR4GtaY4x',
  clientId: 'lcgl2bbjtb4j3qb6i3s5spra',
  // window.location.origin keeps this working for prod
  // (https://board.junioreconomicclub.org) and local dev
  // (http://localhost:4200) without code changes -- but each origin must be
  // registered as an allowed callback + sign-out URL on the Cognito app client.
  redirectUrl: window.location.origin,
  postLogoutRedirectUri: window.location.origin,
  responseType: 'code',
  scope: 'openid profile email',
  useRefreshToken: true,
  silentRenew: true,
  renewTimeBeforeTokenExpiresInSeconds: 30,
  logLevel: LogLevel.Warn,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(),
    provideAnimations(),
    provideAuth({ config: cognitoConfig }),
    // Firebase Analytics (Auth/Firestore removed; Cognito + backend API replace them).
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    // App Check (optional): add a reCAPTCHA v3 site key to enable, e.g.
    // provideAppCheck(() => initializeAppCheck(getApp(), {
    //   provider: new ReCaptchaV3Provider('<RECAPTCHA_SITE_KEY>'),
    //   isTokenAutoRefreshEnabled: true,
    // })),
  ],
};
