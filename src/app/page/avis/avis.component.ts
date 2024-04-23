import { Component } from '@angular/core';

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.scss',
})
export class AvisComponent {
  avisList = [
    {
      nom: 'John Doe',
      date: new Date(2023, 3, 10),
      commentaire: 'Excellent service et nourriture délicieuse!',
    },
    {
      nom: 'Jane Smith',
      date: new Date(2023, 3, 12),
      commentaire: 'Ambiance agréable, mais le service était un peu lent.',
    },
    {
      nom: 'Emily Johnson',
      date: new Date(2023, 3, 15),
      commentaire: "J'ai adoré les plats végétariens disponibles.",
    },
  ];
}
