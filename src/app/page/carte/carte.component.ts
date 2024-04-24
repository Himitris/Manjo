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
      description: 'Frites maison croustillantes servies avec ketchup',
      type: 'Entrée',
    },
    {
      name: 'Risotto',
      price: '17.5',
      description: 'Risotto crémeux aux saveurs italiennes',
      type: 'Plat',
    },
    {
      name: 'Confit',
      price: '20',
      description: 'Canard confit lentement, accompagné de pommes de terre',
      type: 'Plat',
    },
    {
      name: 'Faux filet',
      price: '22',
      description: 'Steak de faux filet grillé, servi avec des légumes',
      type: 'Plat',
    },
    {
      name: 'Magret',
      price: '25',
      description: 'Magret de canard saisi aux fruits rouges',
      type: 'Plat',
    },
    {
      name: '1/2 Magret',
      price: '18',
      description: 'Demi-magret de canard rôti, sauce au miel',
      type: 'Plat',
    },
    {
      name: 'Tartare',
      price: '20',
      description: 'Tartare de bœuf assaisonné, servi avec des frites',
      type: 'Plat',
    },
    {
      name: 'Cassoulet',
      price: '17.5',
      description: 'Plat traditionnel du Sud-Ouest avec haricots et saucisse',
      type: 'Plat',
    },
    {
      name: 'Tarte',
      price: '16',
      description: 'Tarte aux légumes frais et fromage de chèvre',
      type: 'Plat',
    },
    {
      name: 'Saucisse',
      price: '12',
      description: 'Saucisse grillée servie avec de la moutarde',
      type: 'Plat',
    },
    {
      name: 'Salade chèvre',
      price: '16',
      description: 'Salade fraîche avec fromage de chèvre et vinaigrette',
      type: 'Entrée',
    },
    {
      name: 'Salade Végé',
      price: '16',
      description: 'Salade végétarienne colorée avec des légumes frais',
      type: 'Entrée',
    },
    {
      name: 'Soupe',
      price: '6',
      description: 'Soupe du jour, fraîche et délicieuse',
      type: 'Entrée',
    },
    {
      name: 'Mini chèvre',
      price: '6',
      description: 'Petit fromage de chèvre frais, servi avec des toasts',
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
      description: 'Pâté maison préparé avec soin',
      type: 'Entrée',
    },
    {
      name: 'Paté',
      price: '11',
      description: 'Pâté gourmet aux saveurs uniques',
      type: 'Entrée',
    },
    {
      name: 'Charcuterie',
      price: '15',
      description: 'Assortiment de charcuterie fine française',
      type: 'Entrée',
    },
    {
      name: 'Maxi saucisse',
      price: '20',
      description: 'Grande saucisse grillée à déguster',
      type: 'Plat',
    },
    {
      name: 'Maxi Confit',
      price: '30',
      description: 'Confit de canard en version XXL',
      type: 'Plat',
    },
    {
      name: 'Maxi Carne',
      price: '35',
      description: 'Plat copieux de viande grillée',
      type: 'Plat',
    },
    {
      name: 'Maxi tartare',
      price: '28',
      description: 'Gigantesque tartare de bœuf préparé avec amour',
      type: 'Plat',
    },
    {
      name: 'Dessert',
      price: '6',
      description: 'Dessert sucré maison du jour',
      type: 'Dessert',
    },
    {
      name: 'Dessert',
      price: '7',
      description: 'Dessert du chef, un délice sucré surprise',
      type: 'Dessert',
    },
  ];
}
