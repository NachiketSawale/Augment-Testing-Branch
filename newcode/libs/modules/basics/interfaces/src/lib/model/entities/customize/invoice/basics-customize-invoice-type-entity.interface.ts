/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeInvoiceTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	RubricCategoryFk: number;
	Isprogress: boolean;
	Abbreviation: string;
	Abbreviation2: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	Isdeferable: boolean;
	Iscumulativetransaction: boolean;
	Isficorrection: boolean;
}
