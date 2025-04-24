/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialEntity } from '@libs/basics/interfaces';



export interface IUpdatePriceCheckCatalogRequestGenerated {

  /**
   * MaterialResultSet
   */
  MaterialResultSet?: IMaterialEntity[] | null;

  /**
   * SelectedMaterials
   */
  SelectedMaterials?: IMaterialEntity[] | null;
}
