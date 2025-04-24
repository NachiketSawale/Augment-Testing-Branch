/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityTemplateEntity } from './activity-template-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IEventTemplateEntityGenerated extends IEntityBase {

/*
 * ActivityTemplateEntity
 */
  ActivityTemplateEntity?: IActivityTemplateEntity | null;

/*
 * ActivityTemplateFk
 */
  ActivityTemplateFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DistanceTo
 */
  DistanceTo?: number | null;

/*
 * EventTemplateFk
 */
  EventTemplateFk?: number | null;

/*
 * EventTypeFk
 */
  EventTypeFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDisplayed
 */
  IsDisplayed?: boolean | null;

/*
 * PlacedBefore
 */
  PlacedBefore?: boolean | null;
}
