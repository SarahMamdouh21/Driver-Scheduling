import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Driver Scheduling Dashboard';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Initialize theme service and watch for system theme changes
    this.themeService.watchSystemTheme();
  }
}
