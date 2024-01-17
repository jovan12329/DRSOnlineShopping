import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSecondWelcomeComponent } from './user-second-welcome.component';

describe('UserSecondWelcomeComponent', () => {
  let component: UserSecondWelcomeComponent;
  let fixture: ComponentFixture<UserSecondWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSecondWelcomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserSecondWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
