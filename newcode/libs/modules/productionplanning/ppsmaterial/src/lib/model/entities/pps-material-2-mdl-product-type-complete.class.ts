/*
 * Copyright(c) RIB Software GmbH
 */

import { IPpsMaterial2MdlProductTypeEntity } from './pps-material-2-mdl-product-type-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class PpsMaterial2MdlProductTypeComplete implements CompleteIdentification<IPpsMaterial2MdlProductTypeEntity>{

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * PpsMaterial2MdlProductTypes
   */
  public PpsMaterial2MdlProductTypes?: IPpsMaterial2MdlProductTypeEntity[] | null = [];
}
