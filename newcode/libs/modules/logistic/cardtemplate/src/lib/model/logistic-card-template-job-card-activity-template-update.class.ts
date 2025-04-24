/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILogisticCardTemplateJobCardActivityTemplateEntity, ILogisticCardTemplateJobCardRecordTemplateEntity } from '@libs/logistic/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class LogisticCardTemplateJobCardActivityTemplateUpdate implements CompleteIdentification<ILogisticCardTemplateJobCardActivityTemplateEntity> {
	public ActivityTemplateId: number = 0;
	public ActivityTemplates: ILogisticCardTemplateJobCardActivityTemplateEntity | null = null;
	public RecordTemplatesToSave: ILogisticCardTemplateJobCardRecordTemplateEntity[] | null = [];
	public RecordTemplatesToDelete: ILogisticCardTemplateJobCardRecordTemplateEntity[] | null = [];
}