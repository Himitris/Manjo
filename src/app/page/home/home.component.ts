import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  HostListener,
  NgZone,
  OnInit,
  OnDestroy
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
    { icon: '/assets/icon/8.png', title: 'Manjocarn', component: ManjocarnComponent },
    { icon: '/assets/icon/5.png', title: 'Restaurant', component: RestaurantComponent },
    { icon: '/assets/icon/12.png', title: 'La carte', component: CarteComponent },
    { icon: '/assets/icon/6.png', title: 'Payer', component: PayerComponent },
    { icon: '/assets/icon/9.png', title: 'Événements', component: EventComponent },
    { icon: '/assets/icon/3.png', title: 'Activités', component: ActiviteComponent }
  ];

  menuItems = [
    { image: '/assets/plat1.jpg', title: 'Délice du Chef' },
    { image: '/assets/plat2.jpg', title: 'Saveurs Locales' },
    { image: '/assets/plat3.jpg', title: 'Surprise Gourmande' }
  ];

  private timeline: gsap.core.Timeline | null = null;

  constructor(public dialog: MatDialog, private ngZone: NgZone) { }

  ngOnInit() {
    this.updateScreenWidth();
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initAnimations();
    });
  }

  ngOnDestroy() {
    if (this.timeline) {
      this.timeline.kill();
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateScreenWidth();
    this.adjustButtonsPosition();
  }

  updateScreenWidth() {
    this.screenWidth = window.innerWidth;
  }

  adjustButtonsPosition() {
    // Si nécessaire, ajustez la position des boutons ici
  }

  initAnimations(): void {
    this.timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animation du titre
    this.timeline.from('.rustic-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1
    });

    // Animation des boutons de navigation
    this.timeline.from('.nav-item', {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.5');

    // Animation continue des boutons
    gsap.to('.nav-item', {
      y: '+=10',
      yoyo: true,
      repeat: -1,
      duration: 2,
      ease: 'sine.inOut',
      stagger: {
        each: 0.2,
        from: 'random'
      }
    });

    // Effet de parallaxe pour la section héro
    ScrollTrigger.create({
      trigger: this.heroSection.nativeElement,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      animation: gsap.to(this.heroSection.nativeElement, {
        backgroundPositionY: '50%',
        ease: 'none'
      })
    });

    // Animation des éléments du menu
    ScrollTrigger.batch('.menu-item', {
      onEnter: (elements) => {
        gsap.from(elements, {
          opacity: 0,
          y: 50,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out'
        });
      },
      start: 'top 80%'
    });
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