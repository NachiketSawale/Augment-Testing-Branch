/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IPricelistEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CurrencyFk
 */
  CurrencyFk?: number | null;

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
 * EquipmentContextFk
 */
  EquipmentContextFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsManualEditDispatching
 */
  IsManualEditDispatching?: boolean | null;

/*
 * IsManualEditJob
 */
  IsManualEditJob?: boolean | null;

/*
 * IsManualEditPlantMaster
 */
  IsManualEditPlantMaster?: boolean | null;

/*
 * Percent
 */
  Percent?: number | null;

/*
 * PricelistTypeFk
 */
  PricelistTypeFk?: number | null;

/*
 * Priceportion1Name
 */
  Priceportion1Name?: string | null;

/*
 * Priceportion2Name
 */
  Priceportion2Name?: string | null;

/*
 * Priceportion3Name
 */
  Priceportion3Name?: string | null;

/*
 * Priceportion4Name
 */
  Priceportion4Name?: string | null;

/*
 * Priceportion5Name
 */
  Priceportion5Name?: string | null;

/*
 * Priceportion6Name
 */
  Priceportion6Name?: string | null;

/*
 * ReferenceYear
 */
  ReferenceYear?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * ValidFrom
 */
  ValidFrom?: string | null;

/*
 * ValidTo
 */
  ValidTo?: string | null;
}
