/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityTemplateGroupEntity } from './activity-template-group-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IActivityTmplGrp2CUGrpEntityGenerated extends IEntityBase {
  ActivityTemplateGroupEntity?: IActivityTemplateGroupEntity;
  ActivityTemplateGroupFk?: number;
  ControllingGroupDetailFk?: number;
  ControllingGroupFk?: number;
  Id?: number;
}
