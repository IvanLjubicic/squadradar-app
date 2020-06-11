import {
  ONE_SIGNAL_APP_ID,
  GOOGLE_PROJECT_NUMBER,
} from './../../environments/environment';
import { SquadradarApiService } from './../services/squadradar-api.service';
import {
  SquadradarDbService,
  Incident,
} from './../services/squadradar-db.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Plugins } from '@capacitor/core';

const Geolocation = Plugins.Geolocation;
const { Storage } = Plugins;

import { OneSignal } from '@ionic-native/onesignal';

export interface Player {
  playerId: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'incidents',
  templateUrl: 'incidents.page.html',
  styleUrls: ['incidents.page.scss'],
})
export class IncidentsPage implements OnInit, OnDestroy {
  incidents: any = [];
  noIncidents: boolean;
  incidentsType = 'recent';
  latitude: number;
  longitude: number;
  prefDistance: number;

  constructor(
    public db: SquadradarDbService,
    public squadradarApiService: SquadradarApiService
  ) {}

  ngOnInit() {
    this.setPlayerData();
    this.setRecentData();
  }

  async setPlayerData() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.callOneSignal(
      coordinates.coords.latitude,
      coordinates.coords.longitude
    );
  }

  ngOnDestroy() {
    this.updatePlayerData();
  }

  async updatePlayerData() {
    await Geolocation.getCurrentPosition();
    this.updateOneSignal();
  }

  setRecentData() {
    this.squadradarApiService
      .getRecentIncidents()
      .subscribe((incidents: Incident[]) => {
        this.incidents = incidents;
        this.checkIncidentsFlag();
      });
  }

  checkIncidentsFlag() {
    if (this.incidents > 0) {
      this.noIncidents = false;
    } else {
      this.noIncidents = true;
    }
  }

  updateOneSignal() {
    let playerIdToUpdate;
    this.getPlayerIdFromStorage().then((res) => {
      playerIdToUpdate = res;
    });

    const player: Player = {
      playerId: playerIdToUpdate,
      latitude: this.latitude,
      longitude: this.longitude,
    };

    this.squadradarApiService
      .createPlayer(player)
      .subscribe((playerReturned: Player) => {
        console.log('done');
      });
  }

  callOneSignal(latitudeParam: number, longitudeParam: number) {
    const APP_ID = ONE_SIGNAL_APP_ID;
    // for android second parameter, google project id
    const GOOGLE_PROJECT_ID = GOOGLE_PROJECT_NUMBER;
    OneSignal.startInit(APP_ID, GOOGLE_PROJECT_ID);
    OneSignal.endInit();

    OneSignal.getIds().then((data) => {
      // this gives you back the new userId and pushToken associated with the device. Helpful.

      const player: Player = {
        playerId: data.userId,
        latitude: latitudeParam,
        longitude: longitudeParam,
      };

      this.squadradarApiService
        .createPlayer(player)
        .subscribe((playerReturned: Player) => {
          this.setPlayerIdToStorage(player.playerId);
        });
    });
  }

  async setPlayerIdToStorage(playerId: string) {
    await Storage.set({
      key: 'playerId',
      value: playerId,
    });
  }

  updateIncidents() {
    if (this.incidentsType === 'recent') {
      this.setRecentData();
    } else if (this.incidentsType === 'near') {
      this.getNearData();
    } else if (this.incidentsType === 'my') {
      this.db.getDatabaseState().subscribe((rdy) => {
        if (rdy) {
          this.db.getIncidents().subscribe((incidents) => {
            this.incidents = incidents;
            this.checkIncidentsFlag();
          });
        }
      });
    }
  }

  async getNearData() {
    const coordinates = await Geolocation.getCurrentPosition();
    const prefDistance = await this.getPrefDistanceFromStorage();
    this.squadradarApiService
      .getNearIncidents(
        prefDistance,
        coordinates.coords.latitude,
        coordinates.coords.longitude
      )
      .subscribe((incidents: Incident[]) => {
        this.incidents = incidents;
        this.checkIncidentsFlag();
      });
  }

  async getPrefDistanceFromStorage() {
    const { value } = await Storage.get({ key: 'prefDistance' });
    this.prefDistance = +value;
    return +value;
  }

  async getPlayerIdFromStorage(): Promise<string> {
    const { value } = await Storage.get({ key: 'playerId' });
    return value;
  }
}
