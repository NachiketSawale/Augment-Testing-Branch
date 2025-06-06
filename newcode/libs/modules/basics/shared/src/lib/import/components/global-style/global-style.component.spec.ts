import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalStyleComponent } from './global-style.component';

describe('GlobalStyleComponent', () => {
  let component: GlobalStyleComponent;
  let fixture: ComponentFixture<GlobalStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalStyleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
