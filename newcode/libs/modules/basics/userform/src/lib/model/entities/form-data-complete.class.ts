/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IFormDataDetailEntity } from './form-data-detail-entity.interface';
import { IFormDataIntersectionEntity } from './form-data-intersection-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class FormDataComplete implements CompleteIdentification<IFormDataEntity>{

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * FormData
   */
  public FormData?: IFormDataEntity;

  /**
   * FormDataDetailsToDelete
   */
  public FormDataDetailsToDelete?: IFormDataDetailEntity[] | null = [];

  /**
   * FormDataDetailsToSave
   */
  public FormDataDetailsToSave?: IFormDataDetailEntity[] | null = [];

  /**
   * FormDataIntersectionDto
   */
  public FormDataIntersectionDto?: IFormDataIntersectionEntity;

  /**
   * FormDataToDelete
   */
  public FormDataToDelete?: IFormDataEntity[] | null = [];

  /**
   * FormDataToSave
   */
  public FormDataToSave?: IFormDataEntity[] | null = [];

  /**
   * MainItemId
   */
  public MainItemId: number = 0;
}
