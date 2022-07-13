import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Expense } from "./expense.model";
import { newuser } from "./newUser.model";

@Injectable({
    providedIn:'root'
})
export class Auth {
    constructor( private http : HttpClient){}

    databaseUrl:string = 'https://expense-fba32-default-rtdb.asia-southeast1.firebasedatabase.app/';
    APIKEY:String = 'AIzaSyBHz3MhGGtT3QYEUUE2NvcbJD7qhgoCLHI';
    signupUrl:string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.APIKEY}`;
    signinUrl:string =`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.APIKEY}`;

    user$:BehaviorSubject<string> = new BehaviorSubject('');
    userData$:BehaviorSubject<Expense> | BehaviorSubject<undefined> = new BehaviorSubject(undefined);
    userCurrency$:BehaviorSubject<string> = new BehaviorSubject('');
    token$:BehaviorSubject<any> = new BehaviorSubject('');
    
    register(action:String , body:newuser) : Observable<any>{
        let url = action.toUpperCase() == 'LOGIN' ? this.signinUrl : this.signupUrl ;
        return this.http.post(url,body); 
    }

    createDb(str:String,username:String) : Observable<any>{
        let [val] = str.split('@');
        return this.http.post(this.databaseUrl+val+'.json',{
            name:username
        });
    }

    postData(body:any,str:String) : Observable<any> {
        return this.http.post(this.databaseUrl+str+'.json',body);
    }
    
    getData(path:String) : Observable<any> {
        return this.http.get(this.databaseUrl+path+'.json');
    }

    // returnToken(){
    //      this.token$.subscribe({
    //         next: res => {
    //             return res
    //         }
    //     })
    // }
}