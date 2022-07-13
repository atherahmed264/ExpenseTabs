import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Auth } from "./auth.service";
import { take,exhaustMap } from "rxjs/operators";

@Injectable({
    providedIn:'root'
})
export class InterceptorService implements HttpInterceptor {
    constructor(private service:Auth){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.service.token$.pipe(take(1),exhaustMap(res => {
            if(!res){
                return next.handle(req);
            }
            let sessionToken = sessionStorage.getItem('token');
            let token = res
            if(sessionToken){
                let Req = req.clone({
                    headers:req.headers.set('Authorization',sessionToken)
                })
                return next.handle(Req);
            }
            let newReq = req.clone({       
                headers:req.headers.set('Authorization',token)
            })
            return next.handle(newReq);
        }));
    }
}