import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCommonFilterScriptEditorTestComponent } from './filter-script-editor-test.component';

describe('FilterScriptEditorTestComponent', () => {
  let component: UiCommonFilterScriptEditorTestComponent;
  let fixture: ComponentFixture<UiCommonFilterScriptEditorTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiCommonFilterScriptEditorTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiCommonFilterScriptEditorTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
