/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePrjControllingUnitTemplateEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Codetemplate: string;
	Codevalidation: string;
	Assignment01: string;
	Assignment02: string;
	Assignment03: string;
	Assignment04: string;
	Assignment05: string;
	Assignment06: string;
	Assignment07: string;
	Assignment08: string;
	Assignment09: string;
	Assignment10: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
