/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityTemplateGroupEntity } from '@libs/scheduling/templategroup';


export interface IActivityTemplateGroupActionEntityGenerated {

/*
 * Action
 */
  Action?: number | null;

/*
 * TemplateGroup
 */
  TemplateGroup?: IActivityTemplateGroupEntity | null;
}
