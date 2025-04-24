/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { ITemplateActivityTemplateEntityGenerated } from './template-activity-template-entity-generated.interface';

export interface ITemplateActivityTemplateEntity extends ITemplateActivityTemplateEntityGenerated {
	Specification: string | null;
	ControllingUnitTemplate: string | null;
	PerformanceFactor: number | null;
	DescriptionInfo: IDescriptionInfo;
}
