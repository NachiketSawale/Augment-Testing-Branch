/*
* $Id$
* Copyright(c) RIB Software GmbH
*/

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ISortCode07Entity extends IEntityBase  {

	Code?: string | null;
	DescriptionInfo?: IDescriptionInfo | null;
	Id?: number | null;
	ProjectFk?: number | null;
}
