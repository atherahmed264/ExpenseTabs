import { Component, OnInit } from '@angular/core';
import { Auth } from '../Services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor( private service:Auth) { }

  ngOnInit(): void {
    this.service.user$.subscribe( res => console.log(res));
  }

}
