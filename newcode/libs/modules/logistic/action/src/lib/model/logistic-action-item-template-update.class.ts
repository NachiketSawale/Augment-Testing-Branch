/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILogisticActionItemTemp2ItemTypeEntity, ILogisticActionItemTemplateEntity } from '@libs/logistic/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class LogisticActionItemTemplateUpdate implements CompleteIdentification<ILogisticActionItemTemplateEntity> {
	public MainItemId: number = 0;
	public ActionItemTemplates: ILogisticActionItemTemplateEntity | null = null;
	public ActionItemTemp2ItemTypesToSave: ILogisticActionItemTemp2ItemTypeEntity[] | null = [];
	public ActionItemTemp2ItemTypesToDelete: ILogisticActionItemTemp2ItemTypeEntity[] | null = [];
}