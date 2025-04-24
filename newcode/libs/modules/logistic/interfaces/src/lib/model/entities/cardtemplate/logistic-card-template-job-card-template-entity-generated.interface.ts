/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticCardTemplateJobCardTemplateEntityGenerated extends IEntityIdentification, IEntityBase {
	 LogisticContextFk: number;
	 Code: string | null;
	 DescriptionInfo?: IDescriptionInfo | null;
	 Comment?: string | null;
	 Remark?: string | null;
	 WorkOperationTypeFk?: number | null;
	 ResourceFk?: number | null;
	 RubricCategoryFk: number;
}