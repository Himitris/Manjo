import { Component, OnInit } from '@angular/core';
import { InstagramService, InstagramMedia } from '../../services/instagram.service';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss']
})
export class InstagramComponent implements OnInit {
  instagramPosts: InstagramMedia[] = [];
  regularPosts: InstagramMedia[] = [];
  featuredPost: InstagramMedia | null = null;
  loading: boolean = true;
  error: string | null = null;
  expandedCaptions: boolean[] = [];  
  featuredPostIsPortrait: boolean = false;
  videoOrientations: boolean[] = [];

  constructor(private instagramService: InstagramService) { }

  ngOnInit(): void {
    this.fetchInstagramMedia();
  }

  ngAfterViewInit() {
    this.initVideoSizing();
  }

  fetchInstagramMedia(): void {
    this.loading = true;
    this.instagramService.getMedia(12).subscribe({
      next: (media) => {
        this.instagramPosts = media;
        
        // Trouver la dernière vidéo pour la mettre en vedette
        this.featuredPost = this.findFeaturedVideo(media);
        
        // Filtrer les posts réguliers (exclure la vidéo vedette)
        this.regularPosts = this.featuredPost 
          ? media.filter(post => post.id !== this.featuredPost!.id)
          : media;
        
        // Initialiser le tableau des états d'expansion des légendes
        this.expandedCaptions = new Array(this.regularPosts.length).fill(false);
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Impossible de charger les photos Instagram';
        this.loading = false;
        console.error('Erreur Instagram:', err);
      }
    });
  }

  // Méthode pour trouver la dernière vidéo à mettre en vedette
  findFeaturedVideo(posts: InstagramMedia[]): InstagramMedia | null {
    // Rechercher les vidéos
    const videos = posts.filter(post => post.media_type === 'VIDEO');
    
    // S'il y a des vidéos, retourner la première (la plus récente)
    return videos.length > 0 ? videos[0] : null;
  }

  // Méthode pour ouvrir le lien Instagram
  openInstaLink(permalink: string): void {
    window.open(permalink, '_blank');
  }

  initVideoSizing(): void {
    // Attendre que les vidéos soient chargées
    setTimeout(() => {
      document.querySelectorAll('video').forEach(video => {
        // Vérifier quand les métadonnées sont chargées
        if (video.readyState === 0) {
          video.addEventListener('loadedmetadata', () => this.adjustVideoSize(video));
        } else {
          this.adjustVideoSize(video);
        }
      });
    }, 500);
  }

  adjustVideoSize(video: HTMLVideoElement): void {
    const isPortrait = video.videoHeight > video.videoWidth;
    const container = video.closest('.media-container') || video.closest('.featured-media');
    
    if (container) {
      if (isPortrait) {
        container.classList.add('portrait-video');
        
        // Si c'est dans un post standard
        const post = video.closest('.instagram-post');
        if (post) post.classList.add('portrait-post');
      } else {
        container.classList.remove('portrait-video');
        
        const post = video.closest('.instagram-post');
        if (post) post.classList.remove('portrait-post');
      }
    }
  }

  checkVideoOrientation(event: Event, isFeatured: boolean = false, index: number = -1): void {
    const video = event.target as HTMLVideoElement;
    
    // On considère une vidéo comme portrait si sa hauteur est supérieure à sa largeur
    const isPortrait = video.videoHeight > video.videoWidth;
    
    if (isFeatured) {
      this.featuredPostIsPortrait = isPortrait;
    } else if (index >= 0) {
      // S'assurer que le tableau est assez grand
      while (this.videoOrientations.length <= index) {
        this.videoOrientations.push(false);
      }
      this.videoOrientations[index] = isPortrait;
    }
  }
  
  // Méthode pour vérifier si une vidéo spécifique est en format portrait
  isPortraitVideo(index: number): boolean {
    return this.videoOrientations[index] === true;
  }

  // Méthode pour lire la vidéo
  playVideo(event: Event): void {
    const overlay = event.currentTarget as HTMLElement;
    const videoWrapper = overlay.parentElement;
    const video = videoWrapper?.querySelector('video');
    
    if (video) {
      video.play();
      overlay.style.display = 'none';
      
      // Réafficher l'overlay quand la vidéo se termine
      video.addEventListener('ended', () => {
        overlay.style.display = 'flex';
      });
      
      // Réafficher l'overlay quand la vidéo est en pause
      video.addEventListener('pause', () => {
        overlay.style.display = 'flex';
      });
    }
  }

  expandCaption(index: number): void {
    this.expandedCaptions[index] = true;
  }
  
  collapseCaption(index: number): void {
    this.expandedCaptions[index] = false;
  }
}