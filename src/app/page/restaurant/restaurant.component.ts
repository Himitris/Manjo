import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent {
  @ViewChild('fullscreenOverlay') fullscreenOverlay!: ElementRef;

  openFullscreen(event: MouseEvent) {
    const clickedImg = event.target as HTMLImageElement;
    const overlay = document.querySelector(
      '.fullscreen-overlay'
    ) as HTMLElement;
    const fullscreenImg = overlay.querySelector('img') as HTMLImageElement;

    fullscreenImg.src = clickedImg.src;
    overlay.classList.add('active');
  }

  closeFullscreen() {
    const overlay = document.querySelector(
      '.fullscreen-overlay'
    ) as HTMLElement;
    overlay.classList.remove('active');
  }
}
