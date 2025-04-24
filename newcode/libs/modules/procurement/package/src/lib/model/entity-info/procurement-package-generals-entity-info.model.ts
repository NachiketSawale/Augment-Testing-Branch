/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonGeneralsEntityInfo } from '@libs/procurement/common';
import { ProcurementPackageGeneralsDataService } from '../../services/procurement-package-generals-data.service';
import { ProcurementPackageGeneralsValidationService } from '../../services/validations/procurement-package-generals-validation.service';

/**
 * Procurement package generals Entity Info
 */
export const PROCUREMENT_PACKAGE_GENERALS_ENTITY_INFO = ProcurementCommonGeneralsEntityInfo.create({
	permissionUuid: '49def9119f124a4b98ab3ff47d9130f3',
	formUuid: 'd2af94d6aced40edb102a0b890e9f8d8',
	dataServiceToken: ProcurementPackageGeneralsDataService,
	validationServiceToken:ProcurementPackageGeneralsValidationService
});