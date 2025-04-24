/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeClerkRoleEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsUnique: boolean;
	IsLive: boolean;
	IsForPackageAccess: boolean;
	IsForPackage: boolean;
	IsForContract: boolean;
	IsForContractAccess: boolean;
	IsForProject: boolean;
	IsForStock: boolean;
}
