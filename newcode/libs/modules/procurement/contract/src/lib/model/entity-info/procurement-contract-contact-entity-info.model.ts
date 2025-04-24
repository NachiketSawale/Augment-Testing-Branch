/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonContactEntityInfo } from '@libs/procurement/common';
import { ProcurementContractContactDataService } from '../../services/procurement-contract-contact-data.service';

export const PROCUREMENT_CONTRACT_CONTACT_ENTITY_INFO = ProcurementCommonContactEntityInfo.create({
	permissionUuid: '9de5ed967fa84b638446c8c50fdb867a',
	formUuid: 'b5d264adb1f746d9b2055742ca84c7a7',
	dataServiceToken: ProcurementContractContactDataService
});