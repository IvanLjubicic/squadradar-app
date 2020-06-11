import {
  SquadradarDbService,
  Incident,
} from './../services/squadradar-db.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SquadradarApiService } from './../services/squadradar-api.service';
import { Plugins } from '@capacitor/core';
const Geolocation = Plugins.Geolocation;
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'report',
  templateUrl: 'report.page.html',
  styleUrls: ['report.page.scss'],
})
export class ReportPage implements OnInit {
  reportForm: FormGroup;
  latitude: number;
  longitude: number;
  constructor(
    public formBuilder: FormBuilder,
    public db: SquadradarDbService,
    public squadradarApiService: SquadradarApiService,
    public toastController: ToastController
  ) {
    this.getLocation();
  }

  ngOnInit() {
    this.reportForm = new FormGroup({
      nmbrPeople: new FormControl(),
      comment: new FormControl(),
    });
  }

  submitForm() {
    if (!this.reportForm.valid) {
      return false;
    } else {
      const incident: Incident = {
        peopleNumberEstimate: this.reportForm.get('nmbrPeople').value,
        latitude: this.latitude,
        longitude: this.longitude,
        comment: this.reportForm.get('comment').value,
      };

      this.db
        .addIncident(
          this.reportForm.get('nmbrPeople').value,
          this.latitude,
          this.longitude,
          this.reportForm.get('comment').value
        )
        .then((res) => {
          this.squadradarApiService
            .createIncident(incident)
            .subscribe((newProduct) => {
              this.reportForm.reset();
              this.presentToast();
            });
        });
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your report have been saved. Thanks!',
      duration: 5000,
    });
    toast.present();
  }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitude = coordinates.coords.latitude;
    this.longitude = coordinates.coords.longitude;
  }
}
