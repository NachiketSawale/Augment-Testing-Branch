/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityTemplateGroupEntity } from '@libs/scheduling/templategroup';
import { IActivityTemplateEntity } from './activity-template-entity.interface';
import { IActivityTemplateCompleteEntity } from './activity-template-complete-entity.interface';
import { IActivityTmplGrp2CUGrpEntity } from './activity-tmpl-grp-2cugrp-entity.interface';


export interface IActivityTemplateGroupCompleteEntityGenerated {

/*
 * ActivityTemplateGroup
 */
  ActivityTemplateGroup?: IActivityTemplateGroupEntity | null;

/*
 * ActivityTemplateGroups
 */
  ActivityTemplateGroups?: IActivityTemplateGroupEntity[] | null;

/*
 * ActivityTemplateToDelete
 */
  ActivityTemplateToDelete?: IActivityTemplateEntity[] | null;

/*
 * ActivityTemplateToSave
 */
  ActivityTemplateToSave?: IActivityTemplateCompleteEntity[] | null;

/*
 * ActivityTmplGrp2CUGrpToDelete
 */
  ActivityTmplGrp2CUGrpToDelete?: IActivityTmplGrp2CUGrpEntity[] | null;

/*
 * ActivityTmplGrp2CUGrpToSave
 */
  ActivityTmplGrp2CUGrpToSave?: IActivityTmplGrp2CUGrpEntity[] | null;

/*
 * EntitiesCount
 */
  EntitiesCount?: number | null;

/*
 * MainItemId
 */
  MainItemId?: number | null;
}
