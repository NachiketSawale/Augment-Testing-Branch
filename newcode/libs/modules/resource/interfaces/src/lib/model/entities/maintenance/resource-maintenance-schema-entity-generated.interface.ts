/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceMaintenanceSchemaEntityGenerated extends IEntityIdentification, IEntityBase {
	 DescriptionInfo?: IDescriptionInfo | null;
	 Comment?: string | null;
	 EtmContextFk: number;
	 LeadQuantity: number;
	 LeadDays: number;
	 IsDefault: boolean;
	 Sorting: number;
	 IsLive: boolean;
}