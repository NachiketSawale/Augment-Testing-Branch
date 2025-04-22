/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonCallOffAgreementEntityInfo } from '@libs/procurement/common';
import { ProcurementContractCallOffAgreementDataService } from '../../services/procurement-contract-call-off-agreement-data.service';

export const PROCUREMENT_CONTRACT_CALL_OFF_AGREEMENT_ENTITY_INFO = ProcurementCommonCallOffAgreementEntityInfo.create({
	permissionUuid: '16d4b43815ce46bfb37189ec58d973bb',
	formUuid: '7c9932be107843f4979bd93de61f72ad',
	dataServiceToken: ProcurementContractCallOffAgreementDataService
});