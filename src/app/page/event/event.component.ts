import { Component } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent {
  events = [
    { date: 'Le vendredi 28 juin', description: 'Karaoké soirée' },
    { date: 'Le vendredi 5 juillet', description: 'Karaoké soirée' },
    {
      date: 'Le samedi 27 juillet',
      description: 'Cours de salsa (débutant à avancé)',
    },
    {
      date: 'Le dimanche 18 août',
      description: 'Cours de salsa (débutant et avancé)',
    },
  ];
}
