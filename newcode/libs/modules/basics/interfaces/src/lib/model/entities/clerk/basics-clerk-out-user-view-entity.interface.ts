/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

export interface IBasicsClerkOutUserVEntity extends IEntityIdentification {
	Name: string;
	Description: string;
	Email: string;
	Logonname: string;
	IsIncluded: boolean;
}