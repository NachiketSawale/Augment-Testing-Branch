/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstCostcodeAssignDetailEntity } from './est-costcode-assign-detail-entity.interface';
import { IEstTotalDetail2CostTypeEntity } from './est-total-detail-2cost-type-entity.interface';
import { IEstTotalDetail2ResourceFlagEntity } from './est-total-detail-2resource-flag-entity.interface';
import { IEstTotalsConfigEntity } from './est-totals-config-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstTotalsConfigDetailEntityGenerated extends IEntityBase {

/*
 * BasUomFk
 */
  BasUomFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstCostcodeassigndetailEntities
 */
  EstCostcodeassigndetailEntities?: IEstCostcodeAssignDetailEntity[] | null;

/*
 * EstTotalDetail2CostTypeEntities
 */
  EstTotalDetail2CostTypeEntities?: IEstTotalDetail2CostTypeEntity[] | null;

/*
 * EstTotalDetail2CostTypes
 */
  EstTotalDetail2CostTypes?: IEstTotalDetail2CostTypeEntity[] | null;

/*
 * EstTotalDetail2ResourceFlagEntities
 */
  EstTotalDetail2ResourceFlagEntities?: IEstTotalDetail2ResourceFlagEntity[] | null;

/*
 * EstTotalDetail2ResourceFlags
 */
  EstTotalDetail2ResourceFlags?: IEstTotalDetail2ResourceFlagEntity[] | null;

/*
 * EstTotalsconfigEntity
 */
  EstTotalsconfigEntity?: IEstTotalsConfigEntity | null;

/*
 * EstTotalsconfigFk
 */
  EstTotalsconfigFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsBold
 */
  IsBold?: boolean | null;

/*
 * IsItalic
 */
  IsItalic?: boolean | null;

/*
 * IsLabour
 */
  IsLabour?: boolean | null;

/*
 * IsUnderline
 */
  IsUnderline?: boolean | null;

/*
 * LineType
 */
  LineType?: number | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
