import { Component, OnInit } from '@angular/core';

import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

import {
  ADMOB_IS_TESTING,
  ADMOB_BANNER_ID,
} from '../../environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor(private admobFree: AdMobFree) {}

  ngOnInit() {
    this.showBannerAd();
  }

  showBannerAd() {
    const bannerConfig: AdMobFreeBannerConfig = {
      isTesting: ADMOB_IS_TESTING, // Remove in production
      autoShow: true, //
      id: ADMOB_BANNER_ID,
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner
      .prepare()
      .then(() => {
        // success
      })
      .catch((e) => alert(e));
  }
}
