/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityTemplateEntity } from './activity-template-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IPerformanceRuleEntityGenerated extends IEntityBase {

/*
 * ActivityTemplateEntity
 */
  ActivityTemplateEntity?: IActivityTemplateEntity | null;

/*
 * ActivityTemplateFk
 */
  ActivityTemplateFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * PerformanceSheetFk
 */
  PerformanceSheetFk?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * Resource
 */
  Resource?: number | null;

/*
 * UomFk1
 */
  UomFk1?: number | null;

/*
 * UomFk2
 */
  UomFk2?: number | null;
}
