import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConversionComponent } from './user-conversion.component';

describe('UserConversionComponent', () => {
  let component: UserConversionComponent;
  let fixture: ComponentFixture<UserConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserConversionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
