/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticActionItemTemplateEntityGenerated extends IEntityIdentification, IEntityBase {
	 RecordNo: number;
	 DescriptionInfo?: IDescriptionInfo | null;
	 LongDescriptionInfo?: IDescriptionInfo | null;
	 ActionTargetFk: number;
	 Url?: string | null;
	 IsLive: boolean;
	 HasDate: boolean;
	 HasUrl: boolean;
	 HasPrjDoc: boolean;
	 HasPlantCert: boolean;
	 HasBusinessPartner: boolean;
	 HasPrcContract: boolean;
	 HasClerk: boolean;
}