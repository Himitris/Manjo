import { Component } from '@angular/core';
interface Activity {
  name: string;
  description: string;
  icon: string;
}
@Component({
  selector: 'app-activite',
  templateUrl: './activite.component.html',
  styleUrl: './activite.component.scss',
})
export class ActiviteComponent {
  activities: Activity[] = [
    {
      name: 'Paintball',
      description: 'Participez à des jeux de paintball excitants.',
      icon: 'sports_soccer',
    },
    {
      name: 'Canoe',
      description: `Pagayez en harmonie avec la nature lors d'une sortie en canoë.`,
      icon: 'rowing',
    },
    {
      name: 'Randonnée',
      description: 'Découvrez des sentiers de randonnée pittoresques.',
      icon: 'hiking',
    },
    {
      name: 'Accrobranche',
      description: "Aventurez-vous à 1 km pour l'accrobranche.",
      icon: 'park',
    },
    {
      name: 'Trial des 3 rocs',
      description: 'Testez vos compétences sur le parcours Trial des 3 rocs.',
      icon: 'directions_run',
    },
  ];
}
