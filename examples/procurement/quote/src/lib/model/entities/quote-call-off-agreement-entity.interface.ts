/*
 * Copyright(c) RIB Software GmbH
 */


import { IPrcCallOffAgreementEntity } from '@libs/procurement/common';

export interface IProcurementQuoteCallOffAgreementEntity extends IPrcCallOffAgreementEntity {
	QtnHeaderFk: number;
}
