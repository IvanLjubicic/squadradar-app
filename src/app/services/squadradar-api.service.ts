import { Player } from './../incidents/incidents.page';
import { Incident } from './squadradar-db.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { catchError } from 'rxjs/operators';

import { map } from 'rxjs/operators';
import { isUndefined } from 'util';
import { SQUADRADAR_API_BASE_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SquadradarApiService {
  constructor(private httpClient: HttpClient) {}

  // Sending a GET request to /incidents
  public getIncidents(): Observable<Incident[]> {
    return this.httpClient
      .get(SQUADRADAR_API_BASE_URL + '/incidents')

      .pipe(
        map((incidents: any) => {
          const returnIncidents = incidents.eventList;
          return returnIncidents.map((incident: any) => incident);
        }),

        catchError((error: any) => {
          return Observable.throw(error);
        })
      );
  }

  // Sending a recent GET request to /incidents
  public getRecentIncidents(): Observable<Incident[]> {
    console.log('pozvao servis');
    return this.httpClient
      .get(SQUADRADAR_API_BASE_URL + '/incidents/getRecent')

      .pipe(
        map((incidents: any) => {
          const returnIncidents = incidents;
          return returnIncidents.map((incident: any) => incident);
        }),

        catchError((error: any) => {
          return Observable.throw(error);
        })
      );
  }

  // Sending a POST request to /incidents

  public createIncident(incident: Incident): Observable<Incident> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient

      .post(SQUADRADAR_API_BASE_URL + '/incident', incident, {
        headers,
      })

      .pipe(
        map((response: any) => {
          return response;
        }),

        catchError((error: any) => {
          return Observable.throw(error);
        })
      );
  }

  // create or update player id
  public createPlayer(player: Player): Observable<Player> {
    return this.httpClient

      .post(SQUADRADAR_API_BASE_URL + '/player', player)

      .pipe(
        map((response: any) => {
          return response;
        }),

        catchError((error: any) => {
          return Observable.throw(error);
        })
      );
  }

  // Sending a recent GET request to /incidents
  public getNearIncidents(
    prefDistance: number,
    latitude: number,
    longitude: number
  ): Observable<Incident[]> {
    // Initialize Params Object
    let params = new HttpParams();
    // Begin assigning parameters
    params = params.append('latitude', latitude.toString());
    params = params.append('longitude', longitude.toString());
    params = isUndefined(prefDistance)
      ? params
      : params.append('prefDistance', prefDistance.toString());

    return this.httpClient
      .get(SQUADRADAR_API_BASE_URL + '/incidents/getNear', { params })

      .pipe(
        map((incidents: any) => {
          const returnIncidents = incidents.eventList;
          return returnIncidents.map((incident: any) => incident);
        }),

        catchError((error: any) => {
          return Observable.throw(error);
        })
      );
  }
}
