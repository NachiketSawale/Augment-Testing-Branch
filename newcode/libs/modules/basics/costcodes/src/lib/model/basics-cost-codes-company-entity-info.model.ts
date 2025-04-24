/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCostCodesCompanyDataService } from '../services/data-service/basics-cost-codes-company-data.service';
import { ICostCodesUsedCompanyEntity } from './models';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { BasicsCostCodesCompanyLayoutService } from '../services/layout/basics-cost-codes-company-layout.service';


export const BASICS_COST_CODES_COMPANY_ENTITY_INFO: EntityInfo = EntityInfo.create<ICostCodesUsedCompanyEntity>({
	grid: {
		title: { key: 'basics.costcodes' + '.company' },
		containerUuid: '5401b0a75aeb4a259f442a9f13b7dc1a',
		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: ICostCodesUsedCompanyEntity) {
					const service = ctx.injector.get(BasicsCostCodesCompanyDataService);
					return service.parentOf(entity);
				},
				children: function (entity: ICostCodesUsedCompanyEntity) {
					const service = ctx.injector.get(BasicsCostCodesCompanyDataService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<ICostCodesUsedCompanyEntity>;
		}


	},
	dataService: ctx => ctx.injector.get(BasicsCostCodesCompanyDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.CostCodes', typeName: 'CostCodesUsedCompanyDto' },
	permissionUuid: 'ceeb3a8d7f3e41aba9aa126c7a802f87',

	layoutConfiguration: context => {
		return context.injector.get(BasicsCostCodesCompanyLayoutService).generateConfig();
	}

});