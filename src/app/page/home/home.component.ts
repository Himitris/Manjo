import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  HostListener,
  NgZone,
  OnInit,
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
export class HomeComponent implements OnInit, AfterViewInit {
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

  constructor(public dialog: MatDialog, private ngZone: NgZone) {}

  ngOnInit() {
    this.updateScreenWidth();
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initAnimations();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateScreenWidth();
  }

  updateScreenWidth() {
    this.screenWidth = window.innerWidth;
  }

  initAnimations(): void {
    // Parallax effect for hero section
    gsap.to(this.heroSection.nativeElement, {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: this.heroSection.nativeElement,
        scrub: true,
      },
    });

    // Animate menu items
    gsap.from(this.menuPreview.nativeElement.children, {
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.menuPreview.nativeElement,
        start: 'top 80%',
      },
    });

    // Animate nav items
    gsap.from('.nav-item', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
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
