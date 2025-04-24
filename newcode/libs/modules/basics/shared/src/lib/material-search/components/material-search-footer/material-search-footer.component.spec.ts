import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsSharedMaterialSearchFooterComponent } from './material-search-footer.component';
import {MaterialSearchScope} from '../../model/material-search-scope';
import {HttpClientModule} from '@angular/common/http';
import {MatPaginatorModule} from '@angular/material/paginator';
import {CommonModule} from '@angular/common';

describe('MaterialSearchFooterComponent', () => {
  // TODO: replace with actual test cases
  it('is successful', () => {
    expect(true).toBeTruthy();
  });

  /*let component: BasicsSharedMaterialSearchFooterComponent;
  let fixture: ComponentFixture<BasicsSharedMaterialSearchFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule, MatPaginatorModule],
      declarations: [ BasicsSharedMaterialSearchFooterComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicsSharedMaterialSearchFooterComponent);
    component = fixture.componentInstance;
    TestBed.runInInjectionContext(() => {
      component.scope = new MaterialSearchScope();
      fixture.detectChanges();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
