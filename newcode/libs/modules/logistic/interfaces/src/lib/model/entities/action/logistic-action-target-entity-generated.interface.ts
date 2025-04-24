/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticActionTargetEntityGenerated extends IEntityIdentification, IEntityBase {
	 Code: string | null;
	 DescriptionInfo?: IDescriptionInfo | null;
	 Id: number;
}