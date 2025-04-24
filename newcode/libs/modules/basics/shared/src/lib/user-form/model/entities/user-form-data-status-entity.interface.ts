/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

/**
 * Represents the user form data status info.
 */
export interface IUserFormDataStatusEntity extends IEntityIdentification {
	IsReadOnly: boolean;
	IsDefault: boolean;
	Sorting: number;
	Icon: number;
	IsLive: number;
	Code: string;
	DescriptionInfo: IDescriptionInfo;
}