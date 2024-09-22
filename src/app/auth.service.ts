import {Injectable, inject} from "@angular/core";
import {Auth, user} from "@angular/fire/auth";
import { async, from, Observable } from "rxjs";
import { signInWithEmailAndPassword } from "@firebase/auth";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    firebaseAuth = inject(Auth);  

    login(username: string, password: string, chapter: string): Observable<void>{
        const promise = signInWithEmailAndPassword(
            this.firebaseAuth,
            username,
            password,
        ).then(async (userCred) => {
            var res= await userCred.user.getIdTokenResult(true);
            localStorage.setItem('userId', res.claims.sub?.toString()??"")
            localStorage.setItem('tokenId', res.token);
            localStorage.setItem('chapter', chapter);
        });
 
        return from(promise);
    }
}