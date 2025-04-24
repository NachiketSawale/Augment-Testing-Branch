/*
 * Copyright(c) RIB Software GmbH
 */

import { IPpsCad2mdcMaterialEntity } from './pps-cad-2-mdc-material-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class PpsCad2mdcMaterialComplete implements CompleteIdentification<IPpsCad2mdcMaterialEntity>{

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * PpsCad2mdcMaterials
   */
  public PpsCad2mdcMaterials?: IPpsCad2mdcMaterialEntity[] | null = [];
}
