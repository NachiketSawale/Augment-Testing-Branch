/*
 * Copyright(c) RIB Software GmbH
 */

import { IMdcDrawingComponentEntity } from './mdc-drawing-component-entity.interface';
import { IMdcProductDescParamEntity } from './mdc-product-desc-param-entity.interface';
import { IMdcProductDescriptionEntity } from './mdc-product-description-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class MdcProductDescriptionComplete implements CompleteIdentification<IMdcProductDescriptionEntity>{

  /**
   * Id
   */
  public Id: number = 0;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * MdcDrawingComponentToDelete
   */
  public MdcDrawingComponentToDelete?: IMdcDrawingComponentEntity[] | null = [];

  /**
   * MdcDrawingComponentToSave
   */
  public MdcDrawingComponentToSave?: IMdcDrawingComponentEntity[] | null = [];

  /**
   * MdcProductDescParamToDelete
   */
  public MdcProductDescParamToDelete?: IMdcProductDescParamEntity[] | null = [];

  /**
   * MdcProductDescParamToSave
   */
  public MdcProductDescParamToSave?: IMdcProductDescParamEntity[] | null = [];

  /**
   * MdcProductDescription
   */
  public MdcProductDescription?: IMdcProductDescriptionEntity | null;
}
