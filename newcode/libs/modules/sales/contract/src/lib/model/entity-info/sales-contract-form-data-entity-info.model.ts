/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { SalesContractContractsDataService } from '../../services/sales-contract-contracts-data.service';
import { OrdHeaderComplete } from '../models';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';


/**
 * Sales Contract Form Data Entity Info
 */
export const SALES_CONTRACT_FORM_DATA_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IOrdHeaderEntity, OrdHeaderComplete>({
	rubric: Rubric.Order,
	permissionUuid: '13fd1f28813a4772a4ce9074faefcb0a',
	gridTitle: {
		key: 'cloud.common.ContainerUserformDefaultTitle'
	},

	parentServiceFn: (ctx) => {
		return ctx.injector.get(SalesContractContractsDataService);
	},
});