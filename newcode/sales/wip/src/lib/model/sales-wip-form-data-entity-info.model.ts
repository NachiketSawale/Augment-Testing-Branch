/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { SalesWipWipsDataService } from '../services/sales-wip-wips-data.service';
import { WipHeaderComplete } from './wip-header-complete.class';
import { IWipHeaderEntity } from './entities/wip-header-entity.interface';

/**
 * Sales WIP Form Data Entity Info
 */
export const SALES_WIP_FORM_DATA_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IWipHeaderEntity, WipHeaderComplete>({
	rubric: Rubric.Package,
	permissionUuid: 'da8b5f2c30ae4e6dafffdb3db1e17699',
	gridTitle: {
		key: 'cloud.common.ContainerUserformDefaultTitle'
	},

	parentServiceFn: (ctx) => {
		return ctx.injector.get(SalesWipWipsDataService);
	},
});