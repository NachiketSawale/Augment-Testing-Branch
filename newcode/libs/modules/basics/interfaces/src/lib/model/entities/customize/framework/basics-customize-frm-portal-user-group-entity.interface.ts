/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeFrmPortalUserGroupEntity extends IEntityBase, IEntityIdentification {
	Name: number;
	AccessgroupFk: number;
	IsDefault: boolean;
	Sorting: number;
}
