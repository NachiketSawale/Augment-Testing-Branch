import { CompleteIdentification } from '@libs/platform/common';
import { IActivityTemplateEntity } from './entities/activity-template-entity.interface';
import { IActivityCriteriaEntity } from './entities/activity-criteria-entity.interface';
import { IEventTemplateEntity } from './entities/event-template-entity.interface';
import { IPerformanceRuleEntity } from './entities/performance-rule-entity.interface';
import { IActivityTmpl2CUGrpEntity } from './entities/activity-tmpl-2cugrp-entity.interface';
import { IActivityTemplateDocumentEntity } from './entities/activity-template-document-entity.interface';

export interface SchedulingTemplateMainComplete extends CompleteIdentification<IActivityTemplateEntity>{

	MainItemId: number | null;

	ActivityTemplate: IActivityTemplateEntity | null;

	ActivityTemplates: IActivityTemplateEntity[] | null;

	EventTemplateToSave: IEventTemplateEntity[] | null;

	EventTemplateToDelete: IEventTemplateEntity[] | null;

	PerformanceRuleToSave: IPerformanceRuleEntity[] | null;

	PerformanceRuleToDelete: IPerformanceRuleEntity[] | null;

	ActivityTmpl2CUGrpToSave: IActivityTmpl2CUGrpEntity[] | null;

	ActivityTmpl2CUGrpToDelete: IActivityTmpl2CUGrpEntity[] | null;

	ActivityCriteriaToSave: IActivityCriteriaEntity[] | null;

	ActivityCriteriaToDelete: IActivityCriteriaEntity[] | null;

	DocumentToSave: IActivityTemplateDocumentEntity | null;

	DocumentToDelete: IActivityTemplateDocumentEntity | null;
}
