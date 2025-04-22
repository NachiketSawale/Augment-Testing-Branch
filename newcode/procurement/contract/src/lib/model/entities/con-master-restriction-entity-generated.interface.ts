/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IConMasterRestrictionEntityGenerated extends IEntityBase {

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk?: number | null;

  /**
   * BoqItemFk
   */
  BoqItemFk?: number | null;

  /**
   * BoqWicCatFk
   */
  BoqWicCatFk?: number | null;

  /**
   * ConBoqHeaderFk
   */
  ConBoqHeaderFk?: number | null;

  /**
   * ConHeaderBoqFk
   */
  ConHeaderBoqFk?: number | null;

  /**
   * ConHeaderFk
   */
  ConHeaderFk: number;

  /**
   * CopyType
   */
  CopyType: number;

  /**
   * Id
   */
  Id: number;

  /**
   * MdcMaterialCatalogFk
   */
  MdcMaterialCatalogFk?: number | null;

  /**
   * PackageBoqHeaderFk
   */
  PackageBoqHeaderFk?: number | null;

  /**
   * PackageFk
   */
  PackageFk?: number | null;

  /**
   * PrjBoqFk
   */
  PrjBoqFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * Visibility
   */
  Visibility: number;
}
