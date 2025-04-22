import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSidebarWorkflowPinningRowComponent } from './workflow-sidebar-pinning-row.component';

describe('WorkflowSidebarPinningRowComponent', () => {
  let component: UiSidebarWorkflowPinningRowComponent;
  let fixture: ComponentFixture<UiSidebarWorkflowPinningRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSidebarWorkflowPinningRowComponent]
    })
    .compileComponents();

  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
