/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcPacMasterRestrictionEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * BoqItemFk
 */
  BoqItemFk?: number | null;

/*
 * BoqWicCatFk
 */
  BoqWicCatFk?: number | null;

/*
 * ConBoqHeaderFk
 */
  ConBoqHeaderFk?: number | null;

/*
 * ConHeaderFk
 */
  ConHeaderFk?: number | null;

/*
 * CopyType
 */
  CopyType: number;

/*
 * Id
 */
  Id: number;

/*
 * MdcMaterialCatalogFk
 */
  MdcMaterialCatalogFk?: number | null;

/*
 * PackageBoqHeaderFk
 */
  PackageBoqHeaderFk?: number | null;

/*
 * PrcPackageBoqFk
 */
  PrcPackageBoqFk?: number | null;

/*
 * PrcPackageFk
 */
  PrcPackageFk: number;

/*
 * PrjBoqFk
 */
  PrjBoqFk?: number | null;

/*
 * PrjProjectFk
 */
  PrjProjectFk?: number | null;

/*
 * Visibility
 */
  Visibility: number;
}
