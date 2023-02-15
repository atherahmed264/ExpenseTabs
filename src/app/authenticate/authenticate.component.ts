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

  autoEmail!:string;
  autoPass!:string;
  ngOnInit(): void {
    let email = localStorage.getItem('email');
    let pass = atob(localStorage.getItem('pass') as string);
    if(email && pass){
      this.autoPass = pass;
      this.autoEmail = email;
      console.log(email,pass);
    }
    this.loginForm = this.fb.group({
      Email:[email ? email : '',[Validators.required]],
      Password:[pass ? pass : '',[Validators.required]]
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
      let email:string = this.loginForm.value?.Email;
      if(email.includes(' ')) email = email.replace(' ',''); 
      this.serv.register('login',{
        email:email,
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
          localStorage.setItem('email',email.toLowerCase());
          let encrypted = btoa(this.loginForm.value?.Password);
          localStorage.setItem('pass',encrypted);
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
          this.loader = true;
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
          this.loader = false;
          this.signup = false;
          alert('Account Created Sucessfully please login');
        })
      }
    }
    console.log(this.signupForm);
  }

}
