/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LOGISTIC_CARD_TEMPLATE_JOB_CARD_ACTIVITY_TEMPLATE_ENTITY_INFO } from './logistic-card-template-job-card-activity-template-entity-info.model';
import { LOGISTIC_CARD_TEMPLATE_JOB_CARD_RECORD_TEMPLATE_ENTITY_INFO } from './logistic-card-template-job-card-record-template-entity-info.model';
import { LOGISTIC_CARD_TEMPLATE_JOB_CARD_TEMPLATE_DOCUMENT_ENTITY_INFO } from './logistic-card-template-job-card-template-document-entity-info.model';
import { LOGISTIC_CARD_TEMPLATE_JOB_CARD_TEMPLATE_ENTITY_INFO } from './logistic-card-template-job-card-template-entity-info.model';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';

export class LogisticCardTemplateModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance: LogisticCardTemplateModuleInfo = new LogisticCardTemplateModuleInfo();
	public override get internalModuleName(): string {
		return 'logistic.cardtemplate';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Logistic.CardTemplate';
	}
	private readonly translationPrefix: string = 'logistic.cardtemplate';
	public override get entities(): EntityInfo[] {
		return [
			LOGISTIC_CARD_TEMPLATE_JOB_CARD_TEMPLATE_ENTITY_INFO,
			LOGISTIC_CARD_TEMPLATE_JOB_CARD_ACTIVITY_TEMPLATE_ENTITY_INFO,
			LOGISTIC_CARD_TEMPLATE_JOB_CARD_RECORD_TEMPLATE_ENTITY_INFO,
			LOGISTIC_CARD_TEMPLATE_JOB_CARD_TEMPLATE_DOCUMENT_ENTITY_INFO,
		];
	}
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}
	protected override get translationContainer(): string | undefined {
		return '25f9f55bcedb4093bf7c907d1b6c596c';
	}
}