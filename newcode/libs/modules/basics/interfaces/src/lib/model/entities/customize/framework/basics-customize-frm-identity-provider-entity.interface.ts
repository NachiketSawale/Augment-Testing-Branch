/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeFrmIdentityProviderEntity extends IEntityBase, IEntityIdentification {
	Name: number;
	Code: number;
	IsDefault: boolean;
	Sorting: number;
}
