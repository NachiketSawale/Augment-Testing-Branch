/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityCriteriaEntity } from './activity-criteria-entity.interface';
import { IActivityCriteriaCompleteEntity } from './activity-criteria-complete-entity.interface';
import { IActivityTemplateEntity } from './activity-template-entity.interface';
import {IActivityTmplGrp2CUGrpEntity} from '@libs/scheduling/templategroup';
import { IActivityTemplateDocumentEntity } from './activity-template-document-entity.interface';
import { IEventTemplateEntity } from './event-template-entity.interface';
import { IPerformanceRuleEntity } from './performance-rule-entity.interface';


export interface IActivityTemplateCompleteEntityGenerated {

/*
 * ActivityCriteriaToDelete
 */
  ActivityCriteriaToDelete?: IActivityCriteriaEntity[] | null;

/*
 * ActivityCriteriaToSave
 */
  ActivityCriteriaToSave?: IActivityCriteriaCompleteEntity[] | null;

/*
 * ActivityTemplate
 */
  ActivityTemplate?: IActivityTemplateEntity | null;

/*
 * ActivityTemplates
 */
  ActivityTemplates?: IActivityTemplateEntity[] | null;

/*
 * ActivityTmpl2CUGrpToDelete
 */
  ActivityTmpl2CUGrpToDelete?: IActivityTmplGrp2CUGrpEntity[] | null;

/*
 * ActivityTmpl2CUGrpToSave
 */
  ActivityTmpl2CUGrpToSave?: IActivityTmplGrp2CUGrpEntity[] | null;

/*
 * DocumentToDelete
 */
  DocumentToDelete?: IActivityTemplateDocumentEntity[] | null;

/*
 * DocumentToSave
 */
  DocumentToSave?: IActivityTemplateDocumentEntity[] | null;

/*
 * EntitiesCount
 */
  EntitiesCount?: number | null;

/*
 * EventTemplateToDelete
 */
  EventTemplateToDelete?: IEventTemplateEntity[] | null;

/*
 * EventTemplateToSave
 */
  EventTemplateToSave?: IEventTemplateEntity[] | null;

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * PerformanceRuleToDelete
 */
  PerformanceRuleToDelete?: IPerformanceRuleEntity[] | null;

/*
 * PerformanceRuleToSave
 */
  PerformanceRuleToSave?: IPerformanceRuleEntity[] | null;
}
