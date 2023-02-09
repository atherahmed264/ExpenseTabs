import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../Services/auth.service';

@Component({
    selector:'app-details',
    templateUrl:'./details.component.html',
    styles:[`
        .img{
            background-image: url("/assets/pexels-pixabay-259191.jpg");
        }
    `]
})
export class DetailsComponent implements OnInit {
    mostDays: any;
    average: any;

    constructor(private service:Auth,private route:Router,private params:ActivatedRoute,private datePipe:DatePipe){}
    
    user:any;
    id!:any;
    displayData:any;
    date!:any
    total!:number
    customTotal!:number
    custom = false;
    ngOnInit(): void {
        this.service.user$.subscribe( res => this.user=res);
        if (sessionStorage.getItem('user')) {
        this.user = sessionStorage.getItem('user');
        console.log(this.user);
        }
        this.service.userData$.subscribe( val => {
            if(!val){
                this.route.navigate(['/landing']);
                return;
            }
            else{
                this.params.paramMap.subscribe(res => {
                    this.id = res.get('i')
                })
                this.displayData = val[parseInt(this.id)];
                this.date = this.displayData.date
                console.log(this.displayData);
                this.total = this.getTotal(this.displayData.values);
                this.average = this.getAverage(this.displayData.values).toFixed(2);
                this.mostDays = this.getMostDays(this.displayData.values) + `'s`;
            }
        })
    }
    
    getTotal(data:any){
        let sum = data.reduce((acc:any,val:any) => acc + val.amount,0);
        console.log(sum);
        return sum;
    }
    arrayForTotal:any[] = [];
    
    getAverage(data:[{ amount:number,date:string,reason:string,Guid:string}]):number{
        
        let dateArray = data.map(val => {
            let num = val.date.slice(-2);
            return parseInt(num);
        });
        let max = Math.max(...dateArray);
        let noofWeeks = Math.ceil(max/7);
        let spentPerWeek = this.total/noofWeeks;
        return spentPerWeek;
    }
    getMostDays(data:[{ amount:number,date:string,reason:string,Guid:string}]):string{
        let daysArray = data.map(val => {
            let format = this.datePipe.transform(val.date,'EEEE, MMMM d, y');
            if(format){
                let [ day ] = format?.split(',');
                return day;   
            } else {
                return '-';
            }
        });
        let obj = daysArray.reduce((acc:any,val:any) => {
            acc[val] = acc[val] ? acc[val] + 1 : 1;
            return acc;
        },{});
        let copy = Object.keys(obj).reduce((acc:any,val:any) => {
            let key = obj[val].toString();
            acc[key] = val;
            return acc;
        },{});
        let args:number[] = Object.values(obj)
        let result = Math.max(...args);
        return copy[result];
    }

    checked(i:number){
        debugger;
        console.log(i);
        if(this.arrayForTotal.length == 0){
            this.arrayForTotal.push(this.displayData.values[i]);
        }
        else{
            let notFoundCount = 0
            let len = this.arrayForTotal.length
            this.arrayForTotal.forEach( (val,index) => {
                let selected  = JSON.stringify(this.displayData.values[i]);
                let strVal = JSON.stringify(val);
                console.log(selected == strVal);
                if(strVal === selected){
                    // let last = this.arrayForTotal.length - 1;
                    // console.log('index',index,last,index===last);
                    // if(index === last ){
                    //     this.arrayForTotal.pop();
                    // }
                    // else {
                        this.arrayForTotal.splice(index,1);
                        console.log(index);
                        console.log('after splice == ',this.arrayForTotal);
                        return;
                    //}
                }
                else{
                    notFoundCount++
                }
            })
            if(notFoundCount === len){
                this.arrayForTotal.push(this.displayData.values[i]);
                console.log('ppp');
            }
        }
        this.customTotal = this.getTotal(this.arrayForTotal);
    }
    reset(){
        this.custom = !this.custom;
        if(!this.custom) this.arrayForTotal = [];
    }
    delete(item:any,i:number){
        let a = confirm('Are You Sure You Want To Delete This Item');
        if(a){
            console.log(item);
            this.service.deleteItem(this.user,item.Guid).subscribe();
            this.displayData.values.splice(i,1);
            this.total = this.getTotal(this.displayData.values);
        }
        else return;
    }
}