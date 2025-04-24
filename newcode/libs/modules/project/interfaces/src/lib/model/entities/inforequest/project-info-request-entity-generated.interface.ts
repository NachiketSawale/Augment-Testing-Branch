/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';


export interface IProjectInfoRequestEntityGenerated extends IEntityIdentification, IEntityBase {
	 ProjectFk: number;
	 InfoRequestFk: number;
	 ExternalSourceFk: number;
	 ExtGuid: string;
	 ExtName: string;
	 ExtPath: string;
}