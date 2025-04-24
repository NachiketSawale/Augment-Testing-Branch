/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ISelectOptions, getSelectDropdownOptionsToken } from '../../models/select-options.interface';


/**
   * test dialog dropdown options.
   */
const testdialogDropdownOptions: ISelectOptions[] = [
  {
    id: 2,
    displayName: 'Info Box'
  }
];

const dialogWrapper = {
  value: {
    id: 0,
    displayName: ''
  },
};

import { UiCommonSelectDialogOptionsComponent } from './select-dialog-options.component';
import { getCustomDialogDataToken } from '../../../dialogs';

describe('SelectDialogOptionsComponent', () => {
  let component: UiCommonSelectDialogOptionsComponent;
  let fixture: ComponentFixture<UiCommonSelectDialogOptionsComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiCommonSelectDialogOptionsComponent],
      imports: [],
      providers: [{ provide: getSelectDropdownOptionsToken(), useValue: testdialogDropdownOptions },
      {
        provide: getCustomDialogDataToken<ISelectOptions, UiCommonSelectDialogOptionsComponent>(),
        useValue: dialogWrapper,
      },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UiCommonSelectDialogOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
