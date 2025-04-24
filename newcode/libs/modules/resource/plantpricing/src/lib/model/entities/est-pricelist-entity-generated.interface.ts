/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IEstPricelistEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EquipmentCalculationTypeFk
 */
  EquipmentCalculationTypeFk?: number | null;

/*
 * EquipmentCatalogFk
 */
  EquipmentCatalogFk?: number | null;

/*
 * EquipmentDivisionFk
 */
  EquipmentDivisionFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * MasterDataContextFk
 */
  MasterDataContextFk?: number | null;

/*
 * MasterDataLineItemContextFk
 */
  MasterDataLineItemContextFk?: number | null;

/*
 * Percent
 */
  Percent?: number | null;

/*
 * PricelistTypeFk
 */
  PricelistTypeFk?: number | null;

/*
 * ReferenceYear
 */
  ReferenceYear?: number | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;
}
