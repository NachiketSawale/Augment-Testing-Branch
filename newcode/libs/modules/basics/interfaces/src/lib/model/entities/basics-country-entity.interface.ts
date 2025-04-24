/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCountryEntity extends IEntityBase , IEntityIdentification {

	 AreaCode?: string;
	 Iso2?: string;
	 Iso3?: string;
	 Recordstate: boolean;
	 DescriptionInfo?: IDescriptionInfo;
	 AddressFormatFk? : number;
	 IsDefault?: boolean;
	 RecordState?: string;
	 RegexVatno?: string;
	 RegexTaxno?: string;
	 VatNoValidExample?: string;
	 TaxNoValidExample?: string;

}
