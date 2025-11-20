import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BackendService {
  constructor(private http: HttpClient) {}

  getLiveness(): Observable<any> {
    // call relative path so nginx can proxy it in Docker
    return this.http.get('/live');
  }
}
