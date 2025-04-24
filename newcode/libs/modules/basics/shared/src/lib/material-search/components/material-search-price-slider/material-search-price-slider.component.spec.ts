import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsSharedMaterialSearchPriceSliderComponent } from './material-search-price-slider.component';
import { MatSliderModule } from '@angular/material/slider';

describe('BasicsSharedMaterialSearchPriceSliderComponent', () => {
  let component: BasicsSharedMaterialSearchPriceSliderComponent;
  let fixture: ComponentFixture<BasicsSharedMaterialSearchPriceSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSliderModule],
      declarations: [ BasicsSharedMaterialSearchPriceSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicsSharedMaterialSearchPriceSliderComponent);
    component = fixture.componentInstance;

    TestBed.runInInjectionContext(()=>{
      component.price = {
        Min: 0,
        Max: 0,
        Value: [0, 0]
      };
      fixture.detectChanges();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
