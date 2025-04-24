/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticCardTemplateJobCardActivityTemplateUpdate } from './logistic-card-template-job-card-activity-template-update.class';
import { ILogisticCardTemplateJobCardActivityTemplateEntity, ILogisticCardTemplateJobCardTemplateDocumentEntity, ILogisticCardTemplateJobCardTemplateEntity } from '@libs/logistic/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class LogisticCardTemplateJobCardTemplateUpdate implements CompleteIdentification<ILogisticCardTemplateJobCardTemplateEntity> {
	public TemplateId: number = 0;
	public Templates: ILogisticCardTemplateJobCardTemplateEntity[] | null = [];
	public ActivityTemplatesToSave: LogisticCardTemplateJobCardActivityTemplateUpdate[] | null = [];
	public ActivityTemplatesToDelete: ILogisticCardTemplateJobCardActivityTemplateEntity[] | null = [];
	public JobCardTemplateDocumentToSave: ILogisticCardTemplateJobCardTemplateDocumentEntity[] | null = [];
	public JobCardTemplateDocumentToDelete: ILogisticCardTemplateJobCardTemplateDocumentEntity[] | null = [];
}