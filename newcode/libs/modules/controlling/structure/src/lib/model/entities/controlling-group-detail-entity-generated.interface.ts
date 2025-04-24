/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingGroupEntity } from '../models';
import { IControllingUnitGroupEntity } from './controlling-unit-group-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IControllingGroupDetailEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * ControllinggroupEntity
 */
  ControllinggroupEntity?: IControllingGroupEntity | null;

/*
 * ControllinggroupFk
 */
  ControllinggroupFk: number;

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
