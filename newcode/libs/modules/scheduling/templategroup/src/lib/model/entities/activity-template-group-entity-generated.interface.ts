/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityTemplateGroupEntity } from './activity-template-group-entity.interface';
import { IActivityTmplGrp2CUGrpEntity } from './activity-tmpl-grp-2cugrp-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IActivityTemplateGroupEntityGenerated extends IEntityBase {
  ActivityTemplateGroupEntities_ActivityTemplateGroupFk?: Array<IActivityTemplateGroupEntity>;
  ActivityTemplateGroupEntity_ActivityTemplateGroupFk?: IActivityTemplateGroupEntity;
  ActivityTemplateGroupFk?: number;
  ActivityTemplateGroups?: Array<IActivityTemplateGroupEntity>;
  ActivityTmplGrp2CUGrpEntities?: Array<IActivityTmplGrp2CUGrpEntity>;
  Code?: string;
  DescriptionInfo?: IDescriptionInfo;
  HasChildren?: boolean;
  Id?: number;
  SchedulingContextFk?: number;
}
