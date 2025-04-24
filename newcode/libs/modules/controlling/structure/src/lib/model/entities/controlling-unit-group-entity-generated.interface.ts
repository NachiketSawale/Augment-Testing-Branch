/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IControllingUnitEntity } from './controlling-unit-entity.interface';
import { IControllingGroupDetailEntity } from './controlling-group-detail-entity.interface';
import { IControllingGroupEntity } from './controlling-group-entity.interface';

export interface IControllingUnitGroupEntityGenerated extends IEntityBase {

/*
 * ControllinggroupEntity
 */
  ControllinggroupEntity?: IControllingGroupEntity | null;

/*
 * ControllinggroupFk
 */
  ControllinggroupFk: number;

/*
 * ControllinggroupdetailEntity
 */
  ControllinggroupdetailEntity?: IControllingGroupDetailEntity | null;

/*
 * ControllinggroupdetailFk
 */
  ControllinggroupdetailFk: number;

/*
 * ControllingunitEntity
 */
  ControllingunitEntity?: IControllingUnitEntity | null;

/*
 * ControllingunitFk
 */
  ControllingunitFk: number;

/*
 * Id
 */
  Id: number;
}
