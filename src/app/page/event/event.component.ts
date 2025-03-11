import { Component } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent {
  events = [
    { date: 'A venir', description: 'Saison 2025' },
  ];
}
