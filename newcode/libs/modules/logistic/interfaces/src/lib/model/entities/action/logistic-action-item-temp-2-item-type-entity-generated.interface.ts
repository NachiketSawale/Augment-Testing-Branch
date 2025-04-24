/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticActionItemTemp2ItemTypeEntityGenerated extends IEntityIdentification, IEntityBase {
	 ActionItemTemplateFk: number;
	 ActionItemTypeFk: number;
	 Comment?: string | null;
}