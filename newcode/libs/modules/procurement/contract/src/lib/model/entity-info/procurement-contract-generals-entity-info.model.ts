/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonGeneralsEntityInfo } from '@libs/procurement/common';
import { ProcurementContractGeneralsDataService } from '../../services/procurement-contract-generals-data.service';
import { ProcurementContractGeneralsValidationService } from '../../services/procurement-contract-generals-validation.service';

export const PROCUREMENT_CONTRACT_GENERALS_ENTITY_INFO = ProcurementCommonGeneralsEntityInfo.create({
	permissionUuid: '54dc0ae6c79e44548ad5c84edd339db4',
	formUuid: '85354099ae654207b6ab5c3c770f4837',
	dataServiceToken: ProcurementContractGeneralsDataService,
	validationServiceToken:ProcurementContractGeneralsValidationService
});