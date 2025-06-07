import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LegoService {

  constructor(private http: HttpClient) { }

  getAllLegoPieces(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}`);
  }

  getAllSetImages(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/images`);
  }

  getLegoPieceByCode(code: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${code}`);
  }

  getLegoPieceByCategory(category: string, valor: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/category/${category}/${valor}`);
  }

  editLegoPieceInBBDD(id: number, legoPiece: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/${id}`, legoPiece);
  }

  addLegoPieceToBBDD(legoPiece: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}`, legoPiece);
  }

  deleteLegoPieceFromBBDD(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/${id}`);
  }
}
