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
}
