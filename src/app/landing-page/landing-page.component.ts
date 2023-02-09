import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../Services/auth.service';
import { Expense } from '../Services/expense.model';
import { ViewportScroller } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor( private service:Auth ,private route:Router, private scroll:ViewportScroller) { }

  user!:any;
  reason!:String;
  amount!:any;
  date: any= moment().format('YYYY-MM-DD');

  currency:string='';
  month:string = ''
  filterMonth:String[] = [];
  duplicateData:{}[] = []

  add:boolean = false;
  items!:{}[];
  username!:any;
  expenseList!:Expense[];
  displayName!:any;
  dummy:any;
  loader:boolean = false;
  addLoader = false;

  dataDisplay:{}[]=[];
  datesList:{}[] = [];
  userData:any=[];

  ngOnInit(): void {
    this.service.user$.subscribe( res => this.user=res);
    if (sessionStorage.getItem('user')) {
      this.user = sessionStorage.getItem('user');
      console.log(this.user);
    }
    this.loadData();
    this.getMonths();
    console.log(this.date);
  }

  loadData() {
    this.loader = true;
    this.service.getData(this.user).subscribe({
      next: res => {
        this.items = [];
        this.userData = [];
        this.datesList = [];
        for( let key in res){
          res[key].Guid = key;
          this.items.push(res[key]);
        }
        console.log(this.items)
        let [ a , ...b]:any = this.items;
        this.username = this.firstLetterCap(a.name);
        console.log(this.username);
        this.dummy = b;
        this.expenseList = this.dummy;
        this.displayName = this.username?.name;
        console.log('Expenses ==',this.expenseList);
        this.expenseList.forEach( val => {
          let date = new Date(val.date);
          let [a,month,b,year] = date.toString().split(' ');
          this.datesList.push({date:month+' '+year,values:[]});
        })
        console.log(this.datesList);
        this.userData = this.datesList.filter((val:any,i:number) => {
          let _val = JSON.stringify(val) 
          return i == this.datesList.findIndex((x:any) => {
            let str = JSON.stringify(x)
            return str == _val
          })
        })
        console.log(this.userData);
        this.expenseList.forEach( el => {
          this.userData.forEach( (vals:any) => {
            let d = new Date(el.date);
            let [a,month,b,year] = d.toString().split(' ');
            if( month+' '+year == vals.date){
              vals.values.push(el);
            }
          })
        })
        console.log(this.userData);
        this.duplicateData = this.userData;
        this.service.userData$.next(this.userData);
        this.sort()
        this.userData = this.setId(this.userData);
        this.loader = false;
      },
      error: err => {
        console.log(err.message);
        alert(err.message);
      }
    })
  }

  setId(arr:any[]){
    return arr.map( (val,i) => {
      return {
        ...val,
        id:i
      }
    })
  }
  addExpense() {
    if(!this.amount || !this.reason || !this.date){
      alert('Enter All Fields');
      return;
    }
    this.addLoader = true;
    let body:Expense = {
      amount: this.amount,
      reason: this.reason,
      date: this.date,
    }
    this.service.postData(body,this.user)
    .subscribe({
      next: res => {
        this.amount = '';
        this.reason = '';
        
        this.loadData();
        this.addLoader = false;
      },
      error: err => alert(err.message)
    });
  }

  currencyChange() {
    if (this.currency) {
      this.service.userCurrency$.next(this.currency);
    }
    else {
      this.service.userCurrency$.next('')
    }
  }

  getMonths() {
    let date = new Date();
    for(let i=0; i<=11; i++){
      date.setMonth(i);
      let month = date.toLocaleString('en-US', { month:'long'});
      this.filterMonth.push(month);
    }
    console.log(this.filterMonth);
  }
  scrollTo(){
    this.add = !this.add;
    if(this.add){
      setTimeout(() => {
        document.getElementById("addExpense")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
        console.log( document.getElementById("addExpense") , 'aaaaaa');
      },500)
    }
  }

  filterByMonth(ev:any){
    this.userData = this.duplicateData;
    if(!ev){
      return
    }
    console.log(ev);
    let filter = ev;
    this.userData = this.userData.filter( (val:any) => {
      let [a] = val.date.split(' ');
        return filter.includes(a)
      
    })
    console.log(this.userData);
  }

  sorted = false;
    sort(){
      this.userData.reverse();
    }
    view(i:number){
      this.service.userData$.next(this.duplicateData);
      this.route.navigate(['landing',i]);
    }
    dateChanged(ev:any){
      this.date = ev.value;
      console.log(ev.value,'aaaaa')
    }
    firstLetterCap(str:string):string{
      let fst = str[0].toUpperCase();
      let srr = str.replace(str[0],fst); 
      console.log(srr,'capiital',fst)
      return srr
    }
  }

  //NavBar Small reusable component
  @Component({
    selector:'app-nav',
    templateUrl:'./navbar.component.html'
  })
  export class NavbarComponent {
    constructor(private service:Auth,private route:Router){}
    logout(){
      this.service.user$.next('');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      this.route.navigate(['']);  
    }
    routeTo(){
      this.route.navigate(['/landing']);
    }
}