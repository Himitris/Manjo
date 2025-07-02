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
      price: '28',
      description: 'Magret de canard, servi avec des frites maison',
      type: 'Plat',
    },
    {
      name: '1/2 Magret',
      price: '20',
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
      name: "Saucisse Piment d'espelette 500g",
      price: '32',
      description: "Saucisse porc noir au piment d'espelette à partager",
      type: 'Plat',
    },
    {
      name: 'Salade 3 fromages',
      price: '16',
      description: 'Salade fraîche avec 3 fromage (Chèvre, Roquefort, Emmental)',
      type: 'Plat',
    },
    {
      name: 'Salade Gésiers',
      price: '18',
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
      name: 'Paté porc noir',
      price: '9',
      description: "Paté de porc noir au piment d'espelette 130g",
      type: 'Entrée',
    },
    {
      name: 'Rillette porc/canard',
      price: '9',
      description: "Rillette porc et canard 200g",
      type: 'Entrée',
    },
    {
      name: 'Maxi saucisse',
      price: '22',
      description: 'Salade composé, frite et saucisse en grosse portion',
      type: 'Plat',
    },
    {
      name: 'Maxi Confit',
      price: '35',
      description: 'Salade composé, frite et confit en grosse portion',
      type: 'Plat',
    },
    {
      name: 'Maxi Carne',
      price: '40',
      description:
        'Salade composé, frite, saucisse puis magret ou confit au choix',
      type: 'Plat',
    },
    {
      name: 'Dessert',
      price: '7',
      description: 'Dessert du moment',
      type: 'Dessert',
    },
  ];
}
