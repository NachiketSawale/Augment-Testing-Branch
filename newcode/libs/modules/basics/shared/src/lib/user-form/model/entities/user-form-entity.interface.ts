/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

/**
 * Represents the user form info.
 */
export interface IUserFormEntity extends IEntityIdentification {
	RubricFk: number;
	DescriptionInfo: IDescriptionInfo
}