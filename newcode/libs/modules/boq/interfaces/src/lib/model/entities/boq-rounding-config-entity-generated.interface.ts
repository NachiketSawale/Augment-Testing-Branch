/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqRoundingConfigDetailEntity } from './boq-rounding-config-detail-entity.interface';
import { IBoqRoundingConfigTypeEntity } from './boq-rounding-config-type-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IBoqRoundingConfigEntityGenerated extends IEntityBase {

/*
 * BoqRoundingconfigdetailEntities
 */
  BoqRoundingconfigdetailEntities?: IBoqRoundingConfigDetailEntity[] | null;

/*
 * BoqRoundingconfigtypeEntities
 */
  BoqRoundingconfigtypeEntities?: IBoqRoundingConfigTypeEntity[] | null;

/*
 * CloneThisEntity
 */
  CloneThisEntity?: boolean | null;

/*
 * DefaultBoqRoundingConfigDetails
 */
  DefaultBoqRoundingConfigDetails?: IBoqRoundingConfigDetailEntity[] | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * RoundedColumns2DetailTypes
 */
  RoundedColumns2DetailTypes?: unknown | null;
}
