/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityTemplateEntity } from './activity-template-entity.interface';


export interface IActivityTemplateActionEntityGenerated {

/*
 * Action
 */
  Action?: number | null;

/*
 * Template
 */
  Template?: IActivityTemplateEntity | null;
}
