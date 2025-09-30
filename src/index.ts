import { Component, OnInit } from '@angular/core';
import { SkillService, Skill, SkillLevel } from './app/skill.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-root',
  templateUrl: './index.html',
  styleUrls: ['./index.css'],
  standalone: true,
  imports: [
    MatTabsModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    NgxChartsModule,
  ],
})
export class AppComponent implements OnInit {
  skills: Skill[] = [];
  selectedSkillIds: number[] = [];
  skillLevels: SkillLevel[] = [];
  loading = false;
  error = '';

  contactForm: FormGroup;

  // Konfiguracja wykresu ngx-charts
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Zdolność';
  showYAxisLabel = true;
  yAxisLabel = 'Poziom znajomości';
  barPadding = 20;
  roundEdges = true;
  colorScheme = 'cool';

  // dane do wykresu w formacie ngx-charts
  chartData: { name: string; value: number }[] = [];

  constructor(
    private skillService: SkillService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.skillService.getSkills().subscribe({
      next: (skills: Skill[]) => (this.skills = skills),
      error: () =>
        this.snackBar.open('Błąd podczas ładowania zdolności', 'Zamknij', {
          duration: 3000,
        }),
    });
  }

  onCheckboxChange(id: number, event: any) {
    if (event.checked) {
      if (!this.selectedSkillIds.includes(id)) {
        this.selectedSkillIds.push(id);
      }
    } else {
      this.selectedSkillIds = this.selectedSkillIds.filter((x) => x !== id);
    }
  }

  submit() {
    if (this.selectedSkillIds.length === 0) {
      this.snackBar.open('Proszę wybrać co najmniej jedną zdolność.', 'Zamknij', {
        duration: 3000,
      });
      return;
    }
    this.error = '';
    this.loading = true;
    this.skillLevels = [];
    this.chartData = [];

    this.skillService.evaluateSkills(this.selectedSkillIds).subscribe({
      next: (res: SkillLevel[]) => {
        this.chartData = res.map((s: SkillLevel) => ({
          name: s.skillName,
          value: s.level,
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Błąd podczas przesyłania danych.';
        this.loading = false;
      },
    });
  }

  submitContact() {
    if (this.contactForm.invalid) {
      this.snackBar.open('Proszę wypełnić poprawnie formularz kontaktowy.', 'Zamknij', {
        duration: 3000,
      });
      return;
    }
    // Tutaj można dodać logikę wysłania formularza kontaktowego.
    this.snackBar.open('Wiadomość została wysłana. Dziękujemy!', 'Zamknij', {
      duration: 3000,
    });
    this.contactForm.reset();
  }
}
