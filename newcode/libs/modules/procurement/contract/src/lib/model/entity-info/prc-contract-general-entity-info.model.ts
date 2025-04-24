/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcGeneralsEntity, ProcurementCommonGeneralsLayoutService } from '@libs/procurement/common';
import { IEntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ProcurementContractGeneralsDataService } from '../../services/procurement-contract-generals-data.service';
import { ProcurementContractGeneralsValidationService } from '../../services/procurement-contract-generals-validation.service';

/**
 * Entity grid configuration of a "Generals" container inside "Contract Approval Wizard"
 */
export const PRC_CONTRACT_GENERAL_ENTITY_CONFIG: IEntityInfo<IPrcGeneralsEntity> = {
	grid: { title: { text: 'Generals', key: 'procurement.common.general.generalsContainerGridTitle' } },
	permissionUuid: '54dc0ae6c79e44548ad5c84edd339db4',
	dataService: ctx => ctx.injector.get(ProcurementContractGeneralsDataService),
	validationService: (ctx) => ctx.injector.get(ProcurementContractGeneralsValidationService),
	layoutConfiguration:(ctx)  => ctx.injector.get(ProcurementCommonGeneralsLayoutService).generateLayout(ctx, {
		dataServiceToken: ProcurementContractGeneralsDataService
	}) as ILayoutConfiguration<IPrcGeneralsEntity>,
	dtoSchemeId: { moduleSubModule: 'Procurement.Common', typeName: 'PrcGeneralsDto' },
};


