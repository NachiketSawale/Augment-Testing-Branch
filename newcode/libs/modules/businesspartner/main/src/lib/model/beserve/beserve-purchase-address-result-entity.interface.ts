/*
 * Copyright(c) RIB Software GmbH
 */

import { IBeserveBusinessPartnerDataEntity } from './beserve-business-partner-data-entity.interface';

export interface IBeservePurchaseAddressResultEntity {
	resultcode: number;
	resultmessage?: string | null;
	resultdata?: IBeserveBusinessPartnerDataEntity | null;
}
