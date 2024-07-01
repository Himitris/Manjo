import { Component, HostListener } from '@angular/core';

interface MenuItem {
  name: string;
  price: string;
  description: string;
  type: string;
}

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrl: './carte.component.scss',
})
export class CarteComponent {
  screenWidth!: number;

  ngOnInit() {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  public get menuTypes(): string[] {
    return [...new Set(this.menuItems.map((item) => item.type))];
  }

  public filteredMenu(type: string): MenuItem[] {
    return this.menuItems.filter((item) => item.type === type);
  }

  public menuItems: MenuItem[] = [
    {
      name: 'Frites',
      price: '5',
      description: 'Frites maison croustillantes',
      type: 'Entrée',
    },
    {
      name: 'Confit',
      price: '20',
      description: 'Cuisse de canard confit, accompagné de frites maison',
      type: 'Plat',
    },
    {
      name: 'Magret',
      price: '25',
      description: 'Magret de canard, servi avec des frites maison',
      type: 'Plat',
    },
    {
      name: '1/2 Magret',
      price: '18',
      description: 'Demi-magret de canard, servi avec des frites maison',
      type: 'Plat',
    },
    {
      name: 'Tartare',
      price: '20',
      description: 'Tartare de bœuf assaisonné, servi avec des frites maison',
      type: 'Plat',
    },
    {
      name: 'Cassoulet',
      price: '17.5',
      description: 'Plat traditionnel du Sud-Ouest avec haricots et saucisse',
      type: 'Plat',
    },
    {
      name: 'Saucisse',
      price: '12',
      description: 'Saucisse grillée servie avec frite maison et salade',
      type: 'Plat',
    },
    {
      name: 'Saucisse Piment',
      price: '18',
      description: "Saucisse porc noir au piment d'espelette",
      type: 'Plat',
    },
    {
      name: 'Salade chèvre',
      price: '16',
      description: 'Salade fraîche avec fromage de chèvre et vinaigrette',
      type: 'Plat',
    },
    {
      name: 'Salade Végé',
      price: '16',
      description: 'Salade végétarienne colorée avec des légumes frais',
      type: 'Plat',
    },
    {
      name: 'Soupe',
      price: '6',
      description: "Soupe à l'oignon et au fromage",
      type: 'Entrée',
    },
    {
      name: 'Menu enfant',
      price: '8.5',
      description: 'Saucisse de Toulouse, frite maison, salade, glace',
      type: 'Enfant',
    },
    {
      name: 'Menu enfant',
      price: '9.5',
      description: 'Saucisse de Toulouse, frite maison, salade, sirop, glace',
      type: 'Enfant',
    },
    {
      name: 'Paté',
      price: '7',
      description: 'Paté de pintade 90g',
      type: 'Entrée',
    },
    {
      name: 'Rillette',
      price: '12',
      description: "Rillette d'oie",
      type: 'Entrée',
    },
    {
      name: 'Trio de paté',
      price: '14',
      description: "Trio de paté de porc noir, piment d'espelette, rillette porc canard",
      type: 'Entrée',
    },
    {
      name: 'Maxi saucisse',
      price: '20',
      description: 'Salade composé, frite et saucisse en grosse portion',
      type: 'Plat',
    },
    {
      name: 'Maxi Confit',
      price: '30',
      description: 'Salade composé, frite et confit en grosse portion',
      type: 'Plat',
    },
    {
      name: 'Maxi Carne',
      price: '35',
      description: 'Salade composé, frite, saucisse puis magret ou confit au choix',
      type: 'Plat',
    },
    {
      name: 'Dessert',
      price: '6',
      description: 'Dessert du moment',
      type: 'Dessert',
    },
    {
      name: 'Dessert',
      price: '7',
      description: 'Dessert du moment',
      type: 'Dessert',
    },
    {
      name: 'Glaces',
      price: '5',
      description: 'Glaces artisanales',
      type: 'Dessert',
    },
  ];
}
