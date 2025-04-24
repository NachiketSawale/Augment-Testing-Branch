/*
* $Id$
* Copyright(c) RIB Software GmbH
*/

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ISortCode04Entity extends IEntityBase  {

	Code?: string | null;
	DescriptionInfo?: IDescriptionInfo | null;
	Id?: number | null;
	ProjectFk?: number | null;
}
