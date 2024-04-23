import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManjocarnComponent } from './manjocarn.component';

describe('ManjocarnComponent', () => {
  let component: ManjocarnComponent;
  let fixture: ComponentFixture<ManjocarnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManjocarnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManjocarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
