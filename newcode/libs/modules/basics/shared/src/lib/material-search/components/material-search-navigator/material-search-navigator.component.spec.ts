import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsSharedMaterialSearchNavigatorComponent } from './material-search-navigator.component';
import {PlatformCommonModule} from '@libs/platform/common';
import {HttpClientModule} from '@angular/common/http';
import {MaterialSearchScope} from '../../model/material-search-scope';

describe('MaterialSearchNavigatorComponent', () => {
  let component: BasicsSharedMaterialSearchNavigatorComponent;
  let fixture: ComponentFixture<BasicsSharedMaterialSearchNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, PlatformCommonModule],
      declarations: [ BasicsSharedMaterialSearchNavigatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicsSharedMaterialSearchNavigatorComponent);
    component = fixture.componentInstance;

    TestBed.runInInjectionContext(()=>{
      component.scope = new MaterialSearchScope();
      fixture.detectChanges();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
