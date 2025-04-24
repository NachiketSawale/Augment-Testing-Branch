/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticActionItemTemplateUpdate } from './logistic-action-item-template-update.class';
import { ILogisticActionItemTemplateEntity, ILogisticActionTargetEntity } from '@libs/logistic/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class LogisticActionTargetUpdate implements CompleteIdentification<ILogisticActionTargetEntity> {
	public TemplateId: number = 0;
	public Templates: ILogisticActionTargetEntity[] | null = [];
	public ActionItemTemplatesToSave: LogisticActionItemTemplateUpdate[] | null = [];
	public ActionItemTemplatesToDelete: ILogisticActionItemTemplateEntity[] | null = [];
}