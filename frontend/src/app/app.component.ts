import { Component, OnInit } from '@angular/core';
import { BackendService } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Frontend (Angular CLI scaffold)';
  status: string = 'checking...';

  constructor(private backend: BackendService) {}

  ngOnInit(): void {
    this.check();
  }

  check(): void {
    this.status = 'checking...';
    this.backend.getHealth().subscribe({
      next: (res) => this.status = JSON.stringify(res),
      error: (err) => this.status = 'unavailable (' + (err.message || err.statusText || err) + ')'
    });
  }
}
