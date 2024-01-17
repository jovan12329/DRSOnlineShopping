import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductInfoComponent } from './admin-product-info.component';

describe('AdminProductInfoComponent', () => {
  let component: AdminProductInfoComponent;
  let fixture: ComponentFixture<AdminProductInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminProductInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
