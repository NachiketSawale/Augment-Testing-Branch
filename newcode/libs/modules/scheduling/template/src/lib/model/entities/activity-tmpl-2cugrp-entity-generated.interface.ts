/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityTemplateEntity } from './activity-template-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IActivityTmpl2CUGrpEntityGenerated extends IEntityBase {

/*
 * ActivityTemplateEntity
 */
  ActivityTemplateEntity?: IActivityTemplateEntity | null;

/*
 * ActivityTemplateFk
 */
  ActivityTemplateFk?: number | null;

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

/*
 * Inherited
 */
  Inherited?: boolean | null;
}
