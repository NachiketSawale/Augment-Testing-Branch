/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableOverlayContentComponent } from './resizable-overlay-content.component';

describe('ResizableOverlayContentComponent', () => {
  let component: ResizableOverlayContentComponent;
  let fixture: ComponentFixture<ResizableOverlayContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResizableOverlayContentComponent]
    });
    fixture = TestBed.createComponent(ResizableOverlayContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
