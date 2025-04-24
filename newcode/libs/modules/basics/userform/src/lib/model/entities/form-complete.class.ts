/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormEntity } from './form-entity.interface';
import { IFormFieldEntity } from './form-field-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class FormComplete implements CompleteIdentification<IFormEntity>{

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * Form
   */
  public Form?: IFormEntity;

  /**
   * FormFieldsToDelete
   */
  public FormFieldsToDelete?: IFormFieldEntity[] | null = [];

  /**
   * FormFieldsToSave
   */
  public FormFieldsToSave?: IFormFieldEntity[] | null = [];

  /**
   * MainItemId
   */
  public MainItemId: number = 0;
}
