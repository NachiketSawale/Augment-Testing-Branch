/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ICostCodeCompanyEntity } from './models';
import { BasicsCostCodesPriceVersionCompanyDataService } from '../services/data-service/basics-cost-codes-price-version-company-data.service';
import { BasicsCostCodesPriceVersionCompanyLayoutService } from '../services/layout/basics-cost-codes-price-verison-company-layout.service';
import { IGridTreeConfiguration } from '@libs/ui/common';


export const BASICS_COST_CODES_PRICE_VERSION_COMPANY_ENTITY_INFO: EntityInfo = EntityInfo.create<ICostCodeCompanyEntity>({
	grid: {
		title: { key: 'basics.costcodes' + '.priceVerionsToCompany.title' },

		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: ICostCodeCompanyEntity) {
					const service = ctx.injector.get(BasicsCostCodesPriceVersionCompanyDataService);
					return service.parentOf(entity);
				},
				children: function (entity: ICostCodeCompanyEntity) {
					const service = ctx.injector.get(BasicsCostCodesPriceVersionCompanyDataService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<ICostCodeCompanyEntity>;
		}
	},

	dataService: (ctx) => ctx.injector.get(BasicsCostCodesPriceVersionCompanyDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.CostCodes', typeName: 'CostCodesUsedCompanyDto' },
	permissionUuid: '681223e37d524ce0b9bfa2294e18d650',

	layoutConfiguration: (context) => {
		return context.injector.get(BasicsCostCodesPriceVersionCompanyLayoutService).generateConfig();
	}
});
