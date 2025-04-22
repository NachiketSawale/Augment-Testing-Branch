/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonCallOffAgreementEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteCallOffAgreementDataService } from '../../services/quote-contract-call-off-data.service';

export const PROCUREMENT_QUOTE_CALL_OFF_AGREEMENT_ENTITY_INFO = ProcurementCommonCallOffAgreementEntityInfo.create({
	permissionUuid: 'b955eabb69424568857f355e28cdb116',
	formUuid: '43c07f06ee0b40818f217bedeb9928df',
	dataServiceToken: ProcurementQuoteCallOffAgreementDataService
});