/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IBoqCatAssignConfEntity } from './boq-cat-assign-conf-entity.interface';
import { IBoqCatalogEntity } from './boq-catalog-entity.interface';

export interface IBoqCatAssignDetailEntityGenerated extends IEntityBase {

/*
 * BasCostgroupCatFk
 */
  BasCostgroupCatFk?: number | null;

/*
 * BoqCatAssignEntity
 */
  BoqCatAssignEntity?: IBoqCatAssignConfEntity | null;

/*
 * BoqCatAssignFk
 */
  BoqCatAssignFk: number;

/*
 * BoqCatalogEntity
 */
  BoqCatalogEntity?: IBoqCatalogEntity | null;

/*
 * BoqCatalogFk
 */
  BoqCatalogFk: number;

/*
 * CatalogSourceFk
 */
  CatalogSourceFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * GaebId
 */
  GaebId: number;

/*
 * GaebName
 */
  GaebName?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * SearchMode
 */
  SearchMode: number;
}
