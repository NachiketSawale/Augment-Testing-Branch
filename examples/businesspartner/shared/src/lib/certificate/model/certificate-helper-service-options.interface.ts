/*
 * Copyright(c) RIB Software GmbH
 */

import { ICertificateEntity } from '@libs/businesspartner/interfaces';

export interface ICertificateHelperServiceOptions {
	doUpdateReadonly?(entity: ICertificateEntity, typeId: number): void
	setInitBusinessPartnerFk?(created: ICertificateEntity): void
}