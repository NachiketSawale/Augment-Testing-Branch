/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import EstimateMainDissolveAssemblyResourceDialogComponent from './estimate-main-dissolve-assembly-resource-dialog.component';
import { ServiceLocator } from '@libs/platform/common';
import { Injector } from '@angular/core';

describe('Itwo40EstimateMainDissolveAssemblyResourceDialogComponent', () => {
  let component: EstimateMainDissolveAssemblyResourceDialogComponent;
  let fixture: ComponentFixture<EstimateMainDissolveAssemblyResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimateMainDissolveAssemblyResourceDialogComponent],
    }).compileComponents();

	  ServiceLocator.injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(EstimateMainDissolveAssemblyResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
