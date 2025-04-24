/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialStructureLookupEntity } from './material-structure-lookup-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialStructureLookupEntityGenerated {

  /**
   * ChildItems
   */
  ChildItems?: IMaterialStructureLookupEntity[] | null;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IsMaterialCatalog
   */
  IsMaterialCatalog: boolean;

  /**
   * IsMaterialGroup
   */
  IsMaterialGroup: boolean;

  /**
   * MaterialCatalogFk
   */
  MaterialCatalogFk: number;

  /**
   * MaterialGroupFk
   */
  MaterialGroupFk?: number | null;
}
