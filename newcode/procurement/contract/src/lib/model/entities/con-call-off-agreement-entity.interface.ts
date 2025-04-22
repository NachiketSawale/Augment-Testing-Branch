/*
 * Copyright(c) RIB Software GmbH
 */


import { IPrcCallOffAgreementEntity } from '@libs/procurement/common';

export interface IProcurementContractCallOffAgreementEntity extends IPrcCallOffAgreementEntity {
	ConHeaderFk: number;
}
