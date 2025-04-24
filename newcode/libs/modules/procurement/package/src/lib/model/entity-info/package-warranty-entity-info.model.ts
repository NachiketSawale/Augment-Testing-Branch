/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonWarrantyEntityInfo } from '@libs/procurement/common';
import { ProcurementPackageWarrantyDataService } from '../../services/package-warranty-data.service';
import { ProcurementPackageWarrantyValidationService } from '../../services/validations/package-warranty-validation.service';
/**
 * Procurement package Warranty Entity Info
 */
export const PROCUREMENT_PACKAGE_WARRANTY_ENTITY_INFO = ProcurementCommonWarrantyEntityInfo.create({
	permissionUuid: 'a2525a0d73a546fa9990b56cccc0ebb5',
	formUuid: '78a49c3ff455435bad377696a3bc6904',
	dataServiceToken: ProcurementPackageWarrantyDataService,
	validationServiceToken: ProcurementPackageWarrantyValidationService
});