/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityApproverConfigurationService } from '@libs/workflow/common';
import { ProcurementContractHeaderDataService } from '../../services/procurement-contract-header-data.service';
import { ContractComplete } from '../contract-complete.class';
import { IConHeaderEntity } from '../entities';
import { ProcurementInternalModule } from '@libs/procurement/shared';

/**
 * Entity Info of Contract Approver.
 */
export const PRC_CONTRACT_APPROVER_ENTITY_INFO = EntityApproverConfigurationService.prepareApproverEntity<IConHeaderEntity, ContractComplete>({
	containerUuid: 'c6079d3605874e1691c1221c77e8421a',
	entityGUID: 'a853f0b9e5e840d1b5b1882323c1c8f7',
	containerTitle: 'procurement.contract.contractApprover',
	moduleName: ProcurementInternalModule.Contract,
	parentServiceContext: (ctx) => {
		return ctx.injector.get(ProcurementContractHeaderDataService);
	},
});