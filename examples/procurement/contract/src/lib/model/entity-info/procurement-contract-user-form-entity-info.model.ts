/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { IConHeaderEntity } from '../entities';
import { ContractComplete } from '../contract-complete.class';
import { ProcurementContractHeaderDataService } from '../../services/procurement-contract-header-data.service';

export const PROCUREMENT_CONTRACT_USER_FORM_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IConHeaderEntity, ContractComplete>({
	rubric: Rubric.Contract,
	permissionUuid: '13FD1F28813A4772A4CE9074FAEFCB0A',
	gridTitle: {
		key: 'cloud.common.ContainerUserformDefaultTitle'
	},

	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementContractHeaderDataService);
	},
});