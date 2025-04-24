/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticCardTemplateJobCardActivityTemplateEntityGenerated extends IEntityIdentification, IEntityBase {
	 JobCardTemplateFk: number;
	 Code: string | null;
	 DescriptionInfo?: IDescriptionInfo | null;
	 Comment?: string | null;
	 Remark?: string | null;
}