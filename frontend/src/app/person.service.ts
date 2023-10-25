import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Obtém todas as pessoas
  getAllPeople(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pessoas`);
  }

  // Cria uma nova pessoa
  createPerson(person: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pessoas`, person);
  }

  // Atualiza uma pessoa existente
  updatePerson(id: number, person: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/pessoas/${id}`, person);
  }

  // Exclui uma pessoa
  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/pessoas/${id}`);
  }

  // Obtém os dados de uma pessoa por ID
  getPerson(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pessoas/${id}`);
  }

  getPersonById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pessoas/${id}`);
  }
}
