import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RestaurantComponent } from '../restaurant/restaurant.component';
import { EventComponent } from '../event/event.component';
import { CarteComponent } from '../carte/carte.component';
import { PayerComponent } from '../payer/payer.component';
import { ActiviteComponent } from '../activite/activite.component';
import { ManjocarnComponent } from '../manjocarn/manjocarn.component';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
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

  constructor(public dialog: MatDialog) { }

  ngAfterViewInit() {
    this.updateScreenWidth();
    this.adjustButtonsPosition();

    window.onload = () => {
      setTimeout(() => {
        this.initAnimations();
      }, 100);
    };
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
    // Votre code existant pour ajuster la position des boutons
    // ...
  }

  initAnimations(): void {
    // Parallax effect for hero section
    gsap.to(this.heroSection.nativeElement, {
      yPercent: 50,
      ease: "none",
      scrollTrigger: {
        trigger: this.heroSection.nativeElement,
        scrub: true
      }
    });

    // Animate menu items
    gsap.from(this.menuPreview.nativeElement.children, {
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: this.menuPreview.nativeElement,
        start: "top 80%"
      }
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

  // Vous pouvez supprimer les méthodes individuelles d'ouverture de dialogue
  // car elles sont maintenant gérées par la méthode openDialog
}