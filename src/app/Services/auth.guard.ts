import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, take, tap } from "rxjs";
import { Auth } from "./auth.service";

@Injectable({
    providedIn:'root'
})
export class AuthGuard implements CanActivate {
    constructor( private service:Auth, private route:Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        this.service.user$.pipe(take(1),tap(res => {
            let user = !!res
            if(!user) {
                alert('Please Login');
                this.route.navigate(['']);
            }
        }))
        .subscribe( res => {
            return !!res
        })
        return true;
    }
}