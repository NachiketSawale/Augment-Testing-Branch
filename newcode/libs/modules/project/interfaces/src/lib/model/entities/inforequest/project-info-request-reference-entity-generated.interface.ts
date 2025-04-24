/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IProjectInfoRequestReferenceEntityGenerated extends IEntityIdentification, IEntityBase {
	 RequestFromFk: number;
	 RequestToFk: number;
	 ReferenceTypeFk: number;
}