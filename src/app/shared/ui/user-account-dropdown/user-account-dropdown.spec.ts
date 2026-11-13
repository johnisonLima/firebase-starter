import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountDropdown } from './user-account-dropdown';

describe('UserAccountDropdown', () => {
  let component: UserAccountDropdown;
  let fixture: ComponentFixture<UserAccountDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
