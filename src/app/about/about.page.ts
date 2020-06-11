import { Component, OnInit } from '@angular/core';
import * as Constants from '../app.constants';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  type = 'manual';
  about: string;

  constructor() {}

  ngOnInit() {
    this.about = Constants.MANUAL;
  }

  update() {
    if (this.type === 'manual') {
      this.about = Constants.MANUAL;
    } else if (this.type === 'contact') {
      this.about = Constants.CONTACT;
    }
  }
}
