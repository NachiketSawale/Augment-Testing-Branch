/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeQuotationStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsReadOnly: boolean;
	Icon: number;
	IsQuoted: boolean;
	IsOrdered: boolean;
	IsVirtual: boolean;
	IsLive: boolean;
	IsProtected: boolean;
	ShowInPriceComparison: boolean;
	IsEstimate: boolean;
	AccessrightDescriptorFk: number;
	Code: string;
	IsIdealQuote: boolean;
	IsBaselineUpdateInvalid: boolean;
}
