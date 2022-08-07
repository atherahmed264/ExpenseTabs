import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, tap } from "rxjs";
import { Auth } from "./auth.service";

@Injectable({
    providedIn:'root'
})
export class AuthGuard implements CanActivate {
    constructor( private service:Auth, private route:Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        this.service.user$.pipe(tap(res => {
            let user = !!res
            if(!user) {
                alert('Please Login');
                this.route.navigate(['']);
            }
        }))
        .subscribe( res => {
            return !!res
        })
        return false;
    }
}