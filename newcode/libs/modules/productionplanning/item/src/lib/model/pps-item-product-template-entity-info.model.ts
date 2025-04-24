
import * as _ from 'lodash';
import { runInInjectionContext } from '@angular/core';
import { EntityInfo } from '@libs/ui/business-base';
import {
	IPpsProductTemplateEntityGenerated, PpsProductTemplateSharedLayout
} from '@libs/productionplanning/shared';
import { PpsItemProductTemplateDataService } from '../services/product-template/pps-item-product-template-data.service';


export const PPS_ITEM_PRODUCT_TEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsProductTemplateEntityGenerated>({
	grid: false,
	form: {
		containerUuid: '928d8b262d22440398c6dedef62cd3a7',
		title: { key: 'productionplanning.item.productTemplateDetailTitle' },
	},
	dataService: ctx =>   runInInjectionContext(ctx.injector, () => {
		return ctx.injector.get(PpsItemProductTemplateDataService);
	}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.ProductTemplate', typeName: 'ProductDescriptionDto' },
	permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
	layoutConfiguration: _.merge(PpsProductTemplateSharedLayout, {
		overloads: {
		}
	})
});