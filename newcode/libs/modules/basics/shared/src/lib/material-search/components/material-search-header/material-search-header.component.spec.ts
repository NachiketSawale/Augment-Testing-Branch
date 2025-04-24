import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsSharedMaterialSearchHeaderComponent } from './material-search-header.component';
import {MaterialSearchScope} from '../../model/material-search-scope';
import {HttpClientModule} from '@angular/common/http';
import {PlatformCommonModule} from '@libs/platform/common';
import {FormsModule} from '@angular/forms';

describe('MaterialSearchHeaderComponent', () => {
  let component: BasicsSharedMaterialSearchHeaderComponent;
  let fixture: ComponentFixture<BasicsSharedMaterialSearchHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, PlatformCommonModule, FormsModule],
      declarations: [ BasicsSharedMaterialSearchHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicsSharedMaterialSearchHeaderComponent);
    component = fixture.componentInstance;
    TestBed.runInInjectionContext(() => {
      component.scope = new MaterialSearchScope();
      fixture.detectChanges();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
