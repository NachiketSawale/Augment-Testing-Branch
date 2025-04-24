/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IProjectInfoRequest2ExternalEntityGenerated extends IEntityIdentification, IEntityBase {
	 ProjectFk: number;
	 InfoRequestFk: number;
	 ExternalSourceFk: number;
	 ExtGuid: string;
	 ExtName: string;
	 ExtPath: string;
}