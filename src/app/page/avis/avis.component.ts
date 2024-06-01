import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.scss'],
})
export class AvisComponent implements OnInit {
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

  avisTitle = 'Avis des Clients';

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.getGeneralSettings().subscribe((settings) => {
      this.avisTitle = settings.avis_title;
    });
  }
}
