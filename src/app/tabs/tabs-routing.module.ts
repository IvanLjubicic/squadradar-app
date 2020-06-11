import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'incidents',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../incidents/incidents.module').then(
                (m) => m.IncidentsPageModule
              ),
          },
        ],
      },
      {
        path: 'report',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../report/report.module').then((m) => m.ReportPageModule),
          },
        ],
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab-settings/settings.module').then(
                (m) => m.SettingsPageModule
              ),
          },
        ],
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../about/about.module').then((m) => m.AboutPageModule),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/incidents',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/incidents',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
