/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingGroupDetailEntity } from './controlling-group-detail-entity.interface';
import { IControllingUnitGroupEntity } from './controlling-unit-group-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IControllingGroupEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code: string;

/*
 * ControllinggroupdetailEntities
 */
  ControllinggroupdetailEntities?: IControllingGroupDetailEntity[] | null;

/*
 * ControllingunitgroupEntities
 */
  ControllingunitgroupEntities?: IControllingUnitGroupEntity[] | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;
}
