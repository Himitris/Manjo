import { Component } from '@angular/core';

interface Activity {
  name: string;
  description: string;
  icon: string;
  phone?: string;
  website?: string;
  address?: string;
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
      phone: '06 63 01 4219',
      website: 'https://www.valblasterexperience.fr/',
      address: 'Lieu dit Biars, 82140 St Antonin Noble-Val'
    },
    {
      name: 'Canoe',
      description: `Pagayez en harmonie avec la nature lors d'une sortie en canoë.`,
      icon: 'rowing',
      phone: '',
      website: '',
      address: '82140 Saint-Antonin-Noble-Val'
    },
    {
      name: 'Randonnée',
      description: 'Découvrez des sentiers de randonnée pittoresques autour de Saint-Antonin-Noble-Val',
      icon: 'hiking',
      website: 'https://www.alltrails.com/fr/france/tarn-et-garonne/saint-antonin-noble-val',
      address: '82140 Saint-Antonin-Noble-Val'
    },
    {
      name: 'Accrobranche',
      description: "Aventurez-vous à 1 km pour l'accrobranche.",
      icon: 'park',
      phone: '+33 7 60 35 53 14',
      website: 'https://www.parc-aventure-aveyron.com/',
      address: 'Lieu-Dit Turlande, 82140 Saint-Antonin-Noble-Val'
    },
    {
      name: 'Trail des 3 rocs',
      description: 'Testez vos compétences sur le parcours Trail des 3 rocs.',
      icon: 'directions_run',
      website: 'https://www.traildestroisrocs.fr/fr',
    },
    {
      name: 'Escapade Mystère',
      description: 'Partez pour une aventure mystérieuse en Aveyron.',
      icon: 'explore',
      phone: '06 98 90 85 29',
      website: 'https://www.aquobapla.fr/'
    },
    {
      name: 'Comité des fêtes de Varen',
      description: 'Participez aux événements festifs organisés à Varen.',
      icon: 'celebration',
      website: "https://www.intramuros.org/varen/associations/146319"
    },
    {
      name: 'Comité des fêtes de Penne',
      description: 'Découvrez les festivités locales de Penne.',
      icon: 'event',
      website: "https://www.mairie-penne-tarn.fr/association-f332-.html#:~:text=Comit%C3%A9%20des%20F%C3%AAtes,-Organisation%20de%20manisfestations&text=L'association%20est%20l%C3%A0%20pour,partage%20interg%C3%A9n%C3%A9rationnelles%20uniques%20et%20inoubliables.",
    },
    {
      name: 'École de Penne',
      description: "Informez-vous sur l'école primaire de Penne.",
      icon: 'school',
      phone: '05 53 41 22 52',
      address: "22 Rue Jean Moulin, 47140 Penne-d'Agenais"
    },
  ];
}