/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IPrcItemAssignmentEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageItemAssignmentDataService } from '../../services/item-assignment-data.service';
import { ProcurementPackageItemAssignmentValidationService } from '../../services/validations/item-assignment-validation.service';
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementPackageItemAssignmentLayoutService } from '../../services/layout-services/item-assignment-layout.service';
import { ProcurementPackageItemAssignmentBehaviorService } from '../../behaviors/item-assignment-behavior.service';

export const PROCUREMENT_PACKAGE_ITEM_ASSIGNMENT_ENTITY_INFO = EntityInfo.create<IPrcItemAssignmentEntity>({
	grid: {
		title: 'procurement.package.itemAssignment.itemAssignmentGrid',
	},
	form: {
		title: 'procurement.package.itemAssignment.itemAssignmentDetail',
		containerUuid: 'e0e33e68c15d4b4c89dfa27e5fae7005',
	},
	permissionUuid: '49892c71ffee4da096cecfd6834a29b9',
	dataService: (ctx) => ctx.injector.get(ProcurementPackageItemAssignmentDataService),
	validationService: (ctx) => ctx.injector.get(ProcurementPackageItemAssignmentValidationService),
	dtoSchemeId: { moduleSubModule: ProcurementModule.Common, typeName: 'PrcItemAssignmentDto' },
	layoutConfiguration: (ctx) => {
		return ctx.injector.get(ProcurementPackageItemAssignmentLayoutService).generateLayout();
	},
	containerBehavior: (ctx) => ctx.injector.get(ProcurementPackageItemAssignmentBehaviorService),
});