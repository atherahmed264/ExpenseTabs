import { Component, OnInit } from '@angular/core';
import { Auth } from '../Services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { newuser } from '../Services/newUser.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

  constructor( private serv:Auth , private fb:FormBuilder ,private route:Router) { }
  loginForm:any;
  signupForm:any;
  signup:boolean = false
  repass!:String;
  loader=false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      Email:['',[Validators.required,Validators.email]],
      Password:['',[Validators.required]]
    })
    this.signupForm = this.fb.group({
      Username:['',[Validators.required,Validators.minLength(5)]],
      Email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]],
      repass:['',[Validators.required]],
    })
  }

  login(){
    this.loader = true;
    if(this.loginForm.valid){
      this.serv.register('login',{
        email:this.loginForm.value?.Email,
        password:this.loginForm.value?.Password,
        token:true,
      })
      .subscribe({
        next: res => {
          console.log(res);
          this.serv.token$.next(res.idToken);
          sessionStorage.setItem('token',res.idToken);
          let [user] = res.email.split('@');
          this.serv.user$.next(user);
          sessionStorage.setItem('user',user);
          this.route.navigate(['/landing']);
          this.loader = false;
        },
        error: err => {
          console.log(err.message);
          this.loader=false;
          alert('Wrong Email or Password');
        },
      });
    }
  }

  signUp(){
    if(this.signupForm.valid) {

      if(this.signupForm.value?.password != this.signupForm.value?.repass){
        alert('Passwords Dont Match Please Try Again !');
      }
      else {
          let body:newuser = {
          email:this.signupForm.value?.Email,
          password:this.signupForm.value?.password,
          token:true
          }
          let currentUser = this.signupForm.value?.Username;
          let email  = this.signupForm.value?.Email;
          this.serv.register('signup',body).subscribe( res => {
          console.log(res);
          this.serv.createDb(email,currentUser).subscribe(res => console.log(res));
          this.signup = false;
        })
      }
    }
    console.log(this.signupForm);
  }

}
