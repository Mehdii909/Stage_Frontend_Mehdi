import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelComponent } from './personnel.component';

describe('PersonnelComponent', () => {
  let component: PersonnelComponent;
  let fixture: ComponentFixture<PersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonnelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
