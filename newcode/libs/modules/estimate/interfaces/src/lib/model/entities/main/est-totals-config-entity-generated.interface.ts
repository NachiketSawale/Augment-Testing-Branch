/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstConfigEntity } from './est-config-entity.interface';
import { IEstTotalsConfigDetailEntity } from './est-totals-config-detail-entity.interface';
import { IEstTotalsConfigTypeEntity } from './est-totals-config-type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstTotalsConfigEntityGenerated extends IEntityBase {

/*
 * ActivateLeadingStr
 */
  ActivateLeadingStr?: boolean | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstConfigEntities
 */
  EstConfigEntities?: IEstConfigEntity[] | null;

/*
 * EstTotalsconfigdetailEntities
 */
  EstTotalsconfigdetailEntities?: IEstTotalsConfigDetailEntity[] | null;

/*
 * EstTotalsconfigtypeEntities
 */
  EstTotalsconfigtypeEntities?: IEstTotalsConfigTypeEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * LeadingStr
 */
  LeadingStr?: number | null;

/*
 * LeadingStrEntCostgroup
 */
  LeadingStrEntCostgroup?: number | null;

/*
 * LeadingStrPrjCostgroup
 */
  LeadingStrPrjCostgroup?: string | null;
}
