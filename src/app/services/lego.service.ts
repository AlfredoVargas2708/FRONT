import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LegoService {
  private apiUrlCloud = 'https://back-anlk.onrender.com/lego'; // Replace with your actual API URL
  private apiUrl = 'http://localhost:3000/lego'; // Local API URL for development

  constructor(private http: HttpClient) { }

  getAllLegoPieces(): Observable<any> {
    return this.http.get<any>(this.apiUrlCloud);
  }

  getLegoPieceByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlCloud}/${code}`);
  }

  editLegoPieceInBBDD(id: number, legoPiece: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrlCloud}/${id}`, legoPiece);
  }

  addLegoPieceToBBDD(legoPiece: any): Observable<any> {
    return this.http.post<any>(this.apiUrlCloud, legoPiece);
  }
}
