/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBrandEntity extends IEntityBase, IEntityIdentification {
	ContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	UserDefinedText1: string;
	UserDefinedText2: string;
	UserDefinedText3: string;
	UserDefinedText4: string;
	UserDefinedText5: string;
	UserDefinedDate1: Date | string;
	UserDefinedDate2: Date | string;
	UserDefinedDate3: Date | string;
	UserDefinedDate4: Date | string;
	UserDefinedDate5: Date | string;
	UserDefinedNumber1: number;
	UserDefinedNumber2: number;
	UserDefinedNumber3: number;
	UserDefinedNumber4: number;
	UserDefinedNumber5: number;
}
