import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenceComponent } from './agence.component';

describe('AgenceComponent', () => {
  let component: AgenceComponent;
  let fixture: ComponentFixture<AgenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
