import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSidebarWorkflowTabPinComponent } from './workflow-sidebar-tab-pin.component';

describe('WorkflowSidebarTabPinComponent', () => {
  let component: UiSidebarWorkflowTabPinComponent;
  let fixture: ComponentFixture<UiSidebarWorkflowTabPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSidebarWorkflowTabPinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiSidebarWorkflowTabPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
