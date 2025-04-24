import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsSharedMaterialSearchLoadAttributeComponent } from './material-search-load-attribute.component';

describe('MaterialSearchLoadAttributeComponent', () => {
  let component: BasicsSharedMaterialSearchLoadAttributeComponent;
  let fixture: ComponentFixture<BasicsSharedMaterialSearchLoadAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicsSharedMaterialSearchLoadAttributeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicsSharedMaterialSearchLoadAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
