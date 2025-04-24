/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityTemplateGroupEntity } from './activity-template-group-entity.interface';
import { IActivityTmplGrp2CUGrpEntity } from './activity-tmpl-grp-2cugrp-entity.interface';

export interface IActivityTemplateGroupCompleteEntityGenerated {
  ActivityTemplateGroup?: IActivityTemplateGroupEntity | null;
  ActivityTemplateGroups?: Array<IActivityTemplateGroupEntity> | null;
  ActivityTmplGrp2CUGrpToDelete?: Array<IActivityTmplGrp2CUGrpEntity> | null;
  ActivityTmplGrp2CUGrpToSave?: Array<IActivityTmplGrp2CUGrpEntity> | null;
  EntitiesCount?: number | null;
  MainItemId?: number | null;
}
