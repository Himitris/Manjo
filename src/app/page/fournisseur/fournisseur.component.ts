import { Component } from '@angular/core';

interface Supplier {
  name: string;
  type: string; // e.g., Food, Beverage, Equipment
  contact: string;
  email: string;
  phone: string;
  address: string;
  description: string;
}

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrl: './fournisseur.component.scss',
})
export class FournisseurComponent {
  suppliers: Supplier[] = [
    {
      name: 'Boulangerie Chez Louis',
      type: 'Food',
      contact: 'Louis Dupont',
      email: 'louis@example.com',
      phone: '01 23 45 67 89',
      address: '123 Rue de Paris, 75001 Paris',
      description: 'Fournisseur de pain et viennoiseries.',
    },
    {
      name: 'La Cave de Gérard',
      type: 'Beverage',
      contact: 'Gérard Blanc',
      email: 'gerard@example.com',
      phone: '01 98 76 54 32',
      address: '67 Rue du Vin, 33000 Bordeaux',
      description: 'Spécialiste des vins et spiritueux régionaux.',
    },
    {
      name: 'EquipPro',
      type: 'Equipment',
      contact: 'Marie Curie',
      email: 'contact@equippro.example',
      phone: '04 76 54 32 18',
      address: '890 Avenue des Machines, 69000 Lyon',
      description:
        'Tout l’équipement professionnel pour restaurants et hôtels.',
    },
  ];
}
