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
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { RestaurantComponent } from '../restaurant/restaurant.component';
import { EventComponent } from '../event/event.component';
import { CarteComponent } from '../carte/carte.component';
import { PayerComponent } from '../payer/payer.component';
import { ActiviteComponent } from '../activite/activite.component';
import { ManjocarnComponent } from '../manjocarn/manjocarn.component';

gsap.registerPlugin(ScrollTrigger);

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
  ) {}

  ngOnInit() {
    window.addEventListener('resize', this.updateScreenWidth.bind(this));
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
    }
  }

  ngOnDestroy() {
    this.timeline?.kill();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    window.removeEventListener('resize', this.updateScreenWidth);
  }

  private updateScreenWidth() {
    this.screenWidth = window.innerWidth;
  }

  private initAnimations(): void {
    this.timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    this.animateTitle();
    this.animateNavItems();
    this.setupParallax();
  }

  private animateTitle(): void {
    const titleElement = document.querySelector('.rustic-title');
    if (titleElement) {
      this.timeline?.from(titleElement, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
      });
    }
  }

  private animateNavItems(): void {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
      this.timeline?.from(
        navItems,
        {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        },
        '-=0.5'
      );

      gsap.to(navItems, {
        y: '+=30',
        yoyo: true,
        repeat: -1,
        duration: 2,
        ease: 'sine.inOut',
        stagger: { each: 0.2, from: 'random' },
      });
    }
  }

  private setupParallax(): void {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      ScrollTrigger.create({
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to(heroSection, {
          backgroundPositionY: '50%',
          ease: 'none',
        }),
      });
    }
  }

  openDialog(item: any) {
    this.dialog.open(item.component, {
      width: this.screenWidth > 800 ? '60%' : '100%',
      maxWidth: '100%',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms',
    });
  }
}
