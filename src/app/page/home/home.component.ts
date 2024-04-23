import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FournisseurComponent } from '../fournisseur/fournisseur.component';
import { RestaurantComponent } from '../restaurant/restaurant.component';
import { EventComponent } from '../event/event.component';
import { CarteComponent } from '../carte/carte.component';
import { PayerComponent } from '../payer/payer.component';
import { AvisComponent } from '../avis/avis.component';
import { ActiviteComponent } from '../activite/activite.component';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { ManjocarnComponent } from '../manjocarn/manjocarn.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  screenWidth!: number;
  @ViewChild('buttonContainer') buttonContainer!: ElementRef;
  constructor(public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.screenWidth = window.innerWidth;
    const buttons =
      this.buttonContainer.nativeElement.querySelectorAll('button');
    const totalButtons = buttons.length;
    const radius =
      this.screenWidth < 450 ? 100 : this.screenWidth < 800 ? 150 : 350; // Adjust the radius as per your need
    const angleIncrement = (2 * Math.PI) / totalButtons;

    gsap.registerPlugin(CSSPlugin); // Enregistrement du plugin

    // Initial animation to set the buttons in a circular layout
    for (let i = 0; i < totalButtons; i++) {
      const button = buttons[i];
      const angle = i * angleIncrement;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      gsap.set(button, { x, y });
    }

    // Animation to make buttons move slightly around their initial position
    buttons.forEach((button: any, index: any) => {
      const xOffset = Math.random() * 20 - 10; // Random horizontal offset
      const yOffset = Math.random() * 20 - 10; // Random vertical offset
      gsap.to(button, {
        duration: 1,
        repeat: -1,
        yoyo: true,
        x: `+=${xOffset}`,
        y: `+=${yOffset}`,
        ease: 'power1.inOut',
        delay: index * 0.1, // Add delay for staggered animation
      });
    });
  }

  openFournisseurDialog() {
    this.dialog.open(FournisseurComponent, {
      width: '60%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openRestaurantDialog() {
    this.dialog.open(RestaurantComponent, {
      width: '60%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openAvisDialog() {
    this.dialog.open(AvisComponent, {
      width: '60%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openActiviteDialog() {
    this.dialog.open(ActiviteComponent, {
      width: '60%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openEventDialog() {
    this.dialog.open(EventComponent, {
      width: '60%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openCarteDialog() {
    this.dialog.open(CarteComponent, {
      width: '60%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openPayerDialog() {
    this.dialog.open(PayerComponent, {
      width: '60%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openManjocarnDialog() {
    this.dialog.open(ManjocarnComponent, {
      width: '60%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }
}
