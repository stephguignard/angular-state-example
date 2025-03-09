import { Component } from '@angular/core';
import {Card} from 'primeng/card';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    Card,
    RouterLink
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {


}
