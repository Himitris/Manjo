import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  HostListener,
  NgZone,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RestaurantComponent } from '../restaurant/restaurant.component';
import { EventComponent } from '../event/event.component';
import { CarteComponent } from '../carte/carte.component';
import { PayerComponent } from '../payer/payer.component';
import { ActiviteComponent } from '../activite/activite.component';
import { ManjocarnComponent } from '../manjocarn/manjocarn.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  screenWidth!: number;
  @ViewChild('buttonContainer') buttonContainer!: ElementRef;
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('menuPreview') menuPreview!: ElementRef;

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

  menuItems = [
    { image: '/assets/plat1.jpg', title: 'Délice du Chef' },
    { image: '/assets/plat2.jpg', title: 'Saveurs Locales' },
    { image: '/assets/plat3.jpg', title: 'Surprise Gourmande' },
  ];

  private timeline: gsap.core.Timeline | null = null;
  private animationsInitialized = false;

  constructor(public dialog: MatDialog, private ngZone: NgZone) {}

  ngOnInit() {
    this.updateScreenWidth();
  }

  ngAfterViewInit() {
    // Attendre que le DOM soit complètement chargé
    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        this.initAnimations();
      });
    }, 100);
  }

  ngOnDestroy() {
    if (this.timeline) {
      this.timeline.kill();
    }
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateScreenWidth();
  }

  updateScreenWidth() {
    this.screenWidth = window.innerWidth;
  }

  initAnimations(): void {
    if (this.animationsInitialized) return;

    this.timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animation du titre
    const titleElement = document.querySelector('.rustic-title');
    if (titleElement) {
      this.timeline.from(titleElement.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
      });
    }

    // Animation des boutons de navigation
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
      this.timeline.from(
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

      // Animation continue des boutons
      gsap.to(navItems, {
        y: '+=30',
        yoyo: true,
        repeat: -1,
        duration: 2,
        ease: 'sine.inOut',
        stagger: {
          each: 0.2,
          from: 'random',
        },
      });
    }

    // Effet de parallaxe pour la section héro
    if (this.heroSection && this.heroSection.nativeElement) {
      ScrollTrigger.create({
        trigger: this.heroSection.nativeElement,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to(this.heroSection.nativeElement, {
          backgroundPositionY: '50%',
          ease: 'none',
        }),
      });
    }

    // Animation des éléments du menu
    if (this.menuPreview && this.menuPreview.nativeElement) {
      const menuItems =
        this.menuPreview.nativeElement.querySelectorAll('.menu-item');
      if (menuItems.length > 0) {
        ScrollTrigger.batch(menuItems, {
          onEnter: (elements) => {
            gsap.from(elements, {
              opacity: 0,
              y: 50,
              stagger: 0.15,
              duration: 0.8,
              ease: 'power3.out',
            });
          },
          start: 'top 80%',
        });
      }
    }

    this.animationsInitialized = true;
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