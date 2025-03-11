import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

import { RestaurantComponent } from '../restaurant/restaurant.component';
import { EventComponent } from '../event/event.component';
import { CarteComponent } from '../carte/carte.component';
import { PayerComponent } from '../payer/payer.component';
import { ActiviteComponent } from '../activite/activite.component';
import { ManjocarnComponent } from '../manjocarn/manjocarn.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  screenWidth = window.innerWidth;

  navItems = [
    {
      icon: '/assets/icon/8.png',
      title: 'Manjocarn',
      component: ManjocarnComponent,
    },
    {
      icon: '/assets/icon/5.png',
      title: 'Restaurant',
      component: RestaurantComponent,
    },
    {
      icon: '/assets/icon/12.png',
      title: 'La carte',
      component: CarteComponent,
    },
    { icon: '/assets/icon/6.png', title: 'Payer', component: PayerComponent },
    {
      icon: '/assets/icon/9.png',
      title: 'Événements',
      component: EventComponent,
    },
    {
      icon: '/assets/icon/3.png',
      title: 'Activités',
      component: ActiviteComponent,
    },
  ];

  private timeline: gsap.core.Timeline | null = null;

  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.updateScreenWidth.bind(this));
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.timeline?.kill();
      window.removeEventListener('resize', this.updateScreenWidth);
    }
  }

  private updateScreenWidth() {
    this.screenWidth = window.innerWidth;
  }

  private initAnimations(): void {
    // Vérifier si l'utilisateur préfère les mouvements réduits
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Base timeline avec des paramètres optimisés
    this.timeline = gsap.timeline({
      defaults: {
        ease: 'power2.out',
        // Utiliser des valeurs CSS transformées pour améliorer les performances
        force3D: true,
        // Réduire la qualité des animations sur les appareils à faibles performances
        overwrite: 'auto'
      }
    });

    // Animations simplifiées si l'utilisateur préfère moins d'animations
    if (prefersReducedMotion) {
      this.animateWithReducedMotion();
    } else {
      this.animateTitle();
      this.animateNavItems();
    }
  }

  private animateWithReducedMotion(): void {
    // Animation minimale pour les utilisateurs préférant les mouvements réduits
    const titleElement = document.querySelector('.rustic-title');
    const navItems = document.querySelectorAll('.nav-item');

    if (titleElement) {
      gsap.set(titleElement, { opacity: 1, y: 0 });
    }

    if (navItems.length > 0) {
      gsap.set(navItems, { opacity: 1, y: 0 });
    }
  }

  private animateTitle(): void {
    const titleElement = document.querySelector('.rustic-title');
    if (titleElement) {
      this.timeline?.from(titleElement, { y: 30, opacity: 0, duration: 0.8 });
    }
  }

  private animateNavItems(): void {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
      this.timeline?.from(
        navItems,
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
        },
        '-=0.3'
      );
    }
  }
  openDialog(item: any) {
    this.dialog.open(item.component, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'adaptive-modal',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms',
    });
  }
}
