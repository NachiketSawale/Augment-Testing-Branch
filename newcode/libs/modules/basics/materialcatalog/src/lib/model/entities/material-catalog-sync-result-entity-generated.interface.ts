/*
 * Copyright(c) RIB Software GmbH
 */

import { ISelectCatalogApiEntity } from './select-catalog-api-entity.interface';

export interface IMaterialCatalogSyncResultEntityGenerated {

  /**
   * CatalogCodes
   */
  CatalogCodes?: ISelectCatalogApiEntity[] | null;

  /**
   * OriginalCatalogCodes
   */
  OriginalCatalogCodes?: string | null;

  /**
   * SelectLanguageId
   */
  SelectLanguageId: number;
}
