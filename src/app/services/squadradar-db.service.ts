import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Incident {
  id?: number;
  peopleNumberEstimate: number;
  latitude: number;
  longitude: number;
  tstamp?: string;
  comment: string;
}

@Injectable({
  providedIn: 'root',
})
export class SquadradarDbService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  incidents = new BehaviorSubject([]);

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient
  ) {
    this.plt.ready().then(() => {
      this.sqlite
        .create({
          name: 'incidents.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        });
    });
  }

  seedDatabase() {
    this.http
      .get('assets/data/seed.sql', { responseType: 'text' })
      .subscribe((sql) => {
        this.sqlitePorter
          .importSqlToDb(this.database, sql)
          .then((_) => {
            this.loadIncidents();
            this.dbReady.next(true);
          })
          .catch((e) => console.error(e));
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getIncidents(): Observable<Incident[]> {
    return this.incidents.asObservable();
  }

  loadIncidents() {
    return this.database
      .executeSql('SELECT * FROM incidents', [])
      .then((data) => {
        const incidents: Incident[] = [];

        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            incidents.push({
              id: data.rows.item(i).id,
              peopleNumberEstimate: data.rows.item(i).people_number_estimate,
              latitude: data.rows.item(i).latitude,
              longitude: data.rows.item(i).longitude,
              tstamp: data.rows.item(i).tstamp,
              comment: data.rows.item(i).comment,
            });
          }
        }
        this.incidents.next(incidents);
      });
  }

  addIncident(peopleNumberEstimate, latitude, longitude, comment) {
    const data = [peopleNumberEstimate, latitude, longitude, comment];
    return this.database
      .executeSql(
        'INSERT INTO incidents (people_number_estimate, latitude, longitude, comment) VALUES (?, ?, ?, ?)',
        data
      )
      .then((data) => {
        this.loadIncidents();
      });
  }
}
