import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Skill {
  id: number;
  name: string;
}

export interface SkillLevel {
  skillName: string;
  level: number;
}

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = 'https://localhost:5001/api/skills'; // dostosuj port jeśli inny

  constructor(private http: HttpClient) {}

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.apiUrl);
  }

  evaluateSkills(selectedSkillIds: number[]): Observable<SkillLevel[]> {
    return this.http.post<SkillLevel[]>(`${this.apiUrl}/evaluate`, { selectedSkillIds });
  }
}
