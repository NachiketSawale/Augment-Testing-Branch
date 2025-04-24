/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeFrmAccessRoleCategoryEntity extends IEntityBase, IEntityIdentification {
	Name: string;
	Description: string;
}
