/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcAllowanceAreaEntity } from './mdc-allowance-area-entity.interface';
import { IMdcAllArea2GcAreaValueEntity } from './mdc-all-area-2gc-area-value-entity.interface';
import { IMdcAllMarkup2CostCodeEntity } from './mdc-all-markup-2cost-code-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcAllowanceEntityGenerated extends IEntityBase {

/*
 * AllowanceAreaToDelete
 */
  AllowanceAreaToDelete?: IMdcAllowanceAreaEntity[] | null;

/*
 * AllowanceAreaToSave
 */
  AllowanceAreaToSave?: IMdcAllowanceAreaEntity[] | null;

/*
 * AllowanceTypeFk
 */
  AllowanceTypeFk?: number | null;

/*
 * AllowanceValueToDelete
 */
  AllowanceValueToDelete?: IMdcAllArea2GcAreaValueEntity[] | null;

/*
 * AllowanceValueToSave
 */
  AllowanceValueToSave?: IMdcAllArea2GcAreaValueEntity[] | null;

/*
 * BasQuantityTypeFk
 */
  BasQuantityTypeFk?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * IsBalanceFP
 */
  IsBalanceFP?: boolean | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsDeleteOldData
 */
  IsDeleteOldData?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * IsOneStep
 */
  IsOneStep?: boolean | null;

/*
 * MarkupAm
 */
  MarkupAm?: number | null;

/*
 * MarkupAmSc
 */
  MarkupAmSc?: number | null;

/*
 * MarkupCalcTypeFk
 */
  MarkupCalcTypeFk?: number | null;

/*
 * MarkupGa
 */
  MarkupGa?: number | null;

/*
 * MarkupGaSc
 */
  MarkupGaSc?: number | null;

/*
 * MarkupRp
 */
  MarkupRp?: number | null;

/*
 * MarkupRpSc
 */
  MarkupRpSc?: number | null;

/*
 * MasterContextFk
 */
  MasterContextFk?: number | null;

/*
 * MdcAllAreaGroupTypeFk
 */
  MdcAllAreaGroupTypeFk?: number | null;

/*
 * MdcAllMarkup2CostCodes
 */
  MdcAllMarkup2CostCodes?: IMdcAllMarkup2CostCodeEntity[] | null;

/*
 * MdcAllMarkup2CostCodesToDelete
 */
  MdcAllMarkup2CostCodesToDelete?: IMdcAllMarkup2CostCodeEntity[] | null;
}
