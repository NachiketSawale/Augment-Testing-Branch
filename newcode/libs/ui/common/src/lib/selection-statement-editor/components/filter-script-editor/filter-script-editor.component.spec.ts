import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCommonFilterScriptEditorComponent } from './filter-script-editor.component';

describe('ScriptEditorComponent', () => {
  let component: UiCommonFilterScriptEditorComponent;
  let fixture: ComponentFixture<UiCommonFilterScriptEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiCommonFilterScriptEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiCommonFilterScriptEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
