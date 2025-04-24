/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICompanyControllingGroupEntity extends IEntityBase {
	CompanyFk?: number | null;
	ControllingGroupFk?: number | null;
	ControllingGrpDetailFk?: number | null;
	Id?: number | null;
}
