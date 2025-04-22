import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerLayoutService } from '@libs/businesspartner/main';
import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { ProcurementPriceComparisonBusinessPartnerDataService } from '../../services/business-partner-data.service';
import { ProcurementPriceComparisonBusinessPartnerBehavior } from '../../behaviors/business-partner-behavior.service';

export const PRICE_COMPARISON_BUSINESS_PARTNER_ENTITY_INFO = EntityInfo.create<IBusinessPartnerEntity>({
	grid: {
		title: {
			text: 'Business Partner',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.headerGridContainerTitle'
		},
		behavior: (ctx) => ctx.injector.get(ProcurementPriceComparisonBusinessPartnerBehavior),
	},
	dataService: (ctx) => ctx.injector.get(ProcurementPriceComparisonBusinessPartnerDataService),
	dtoSchemeId: {
		moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName,
		typeName: 'BusinessPartnerDto'
	},
	permissionUuid: '75dcd826c28746bf9b8bbbf80a1168e8',
	layoutConfiguration: context => {
		return context.injector.get(BusinesspartnerLayoutService).generateLayout();
	}
});