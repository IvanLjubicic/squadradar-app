import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  constructor() {}

  onChange($event) {
    console.log($event.target.value);
    this.setPlayerIdToStorage($event.target.value);
  }

  async setPlayerIdToStorage(prefDistance: string) {
    await Storage.set({
      key: 'prefDistance',
      value: prefDistance,
    });
  }
}
