/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export interface IBankEntity extends  IEntityIdentification {
	 Id: number;
	 BasCountryFk: number;
	 SortCode?: string | null;
	 BankName?: string | null;
	 Street?: string | null;
	 Zipcode?: string | null;
	 City?: string | null;
	 Bic?: string | null;
	 Iso2?: string | null;
	 Iso3?: string | null;
	 Description?: string | null;
	 DescriptionInfo: IDescriptionInfo;
}
