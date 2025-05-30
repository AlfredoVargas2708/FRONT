import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LegoService {
  private apiUrl = 'http://localhost:3000/lego'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getLegoPieces(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getLegoPieceByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${code}`);
  }
}
