import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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

    if (this.screenWidth < 500) {
      // Si l'écran est petit, placer les boutons légèrement à gauche et à droite et faire bouger les boutons
      buttons.forEach((button: any, index: any) => {
        const xOffset = index % 2 === 0 ? -50 : 50; // Décalage horizontal de -50 pour les boutons pairs et 50 pour les impairs
        const yOffset = index * 50; // Décalage vertical
        gsap.set(button, { x: xOffset, y: yOffset });

        // Animation pour faire bouger légèrement les boutons autour de leur position initiale
        gsap.to(button, {
          duration: 1,
          repeat: -1,
          yoyo: true,
          x: `+=${Math.random() * 20 - 10}`, // Décalage horizontal aléatoire entre -10 et 10
          y: `+=${Math.random() * 20 - 10}`, // Décalage vertical aléatoire entre -10 et 10
          ease: 'power1.inOut',
        });

      });
    } else {
      // Sinon, placer les boutons en cercle comme précédemment
      const radius =
        this.screenWidth < 450 ? 100 : this.screenWidth < 800 ? 150 : 350; // Ajuster le rayon selon vos besoins
      const angleIncrement = (2 * Math.PI) / totalButtons;

      // Disposition circulaire initiale des boutons
      for (let i = 0; i < totalButtons; i++) {
        const button = buttons[i];
        const angle = i * angleIncrement;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        gsap.set(button, { x, y });
      }

      // Animation pour faire bouger légèrement les boutons autour de leur position initiale
      buttons.forEach((button: any, index: any) => {
        gsap.to(button, {
          duration: 1,
          repeat: -1,
          yoyo: true,
          x: `+=${Math.random() * 20 - 10}`, // Décalage horizontal aléatoire
          y: `+=${Math.random() * 20 - 10}`, // Décalage vertical aléatoire
          ease: 'power1.inOut',
          delay: index * 0.1, // Ajouter un délai pour une animation échelonnée
        });
      });
    }
  }

  openFournisseurDialog() {
    this.dialog.open(FournisseurComponent, {
      width: this.screenWidth > 800 ? '60%' : '90%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openRestaurantDialog() {
    this.dialog.open(RestaurantComponent, {
      width: this.screenWidth > 800 ? '60%' : '90%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openAvisDialog() {
    this.dialog.open(AvisComponent, {
      width: this.screenWidth > 800 ? '60%' : '90%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openActiviteDialog() {
    this.dialog.open(ActiviteComponent, {
      width: this.screenWidth > 800 ? '60%' : '90%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openEventDialog() {
    this.dialog.open(EventComponent, {
      width: this.screenWidth > 800 ? '40%' : '90%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openCarteDialog() {
    this.dialog.open(CarteComponent, {
      width: this.screenWidth > 800 ? '60%' : '90%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openPayerDialog() {
    this.dialog.open(PayerComponent, {
      width: this.screenWidth > 800 ? '60%' : '90%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }

  openManjocarnDialog() {
    this.dialog.open(ManjocarnComponent, {
      width: this.screenWidth > 800 ? '60%' : '90%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }
}
