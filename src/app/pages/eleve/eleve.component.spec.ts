import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleveComponent } from './eleve.component';

describe('EleveComponent', () => {
  let component: EleveComponent;
  let fixture: ComponentFixture<EleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EleveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
