import { Component } from '@angular/core';

interface Dish {
  name: string;
  price: number;
}

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss',
})
export class RestaurantComponent {
  dishes: Dish[] = [
    { name: 'Salade du jardin', price: 12.5 },
    { name: 'Truite de la rivière', price: 18.75 },
    { name: 'Tarte aux pommes maison', price: 6.0 },
  ];
}
