/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityTemplateGroupEntity } from '@libs/scheduling/templategroup';
import { IEntityBase } from '@libs/platform/common';


export interface IActivityTmplGrp2CUGrpEntityGenerated extends IEntityBase {

/*
 * ActivityTemplateGroupEntity
 */
  ActivityTemplateGroupEntity?: IActivityTemplateGroupEntity | null;

/*
 * ActivityTemplateGroupFk
 */
  ActivityTemplateGroupFk?: number | null;

/*
 * ControllingGroupDetailFk
 */
  ControllingGroupDetailFk?: number | null;

/*
 * ControllingGroupFk
 */
  ControllingGroupFk?: number | null;

/*
 * Id
 */
  Id?: number | null;
}
