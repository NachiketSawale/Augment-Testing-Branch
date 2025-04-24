import { EntityInfo } from '@libs/ui/business-base';
import {
	IPpsProductTemplateEntityGenerated, PpsProductTemplateSharedLayout,
} from '@libs/productionplanning/shared';
import * as _ from 'lodash';

import { runInInjectionContext } from '@angular/core';
import { DrawingDataService } from '../services/drawing-data.service';
import { DrawingProductTemplateDataService } from '../services/drawing-product-template-data.service';


export const PRODUCTIONPLANNING_DRAWING_PRODUCT_TEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsProductTemplateEntityGenerated>({
	grid: {
		title: { key: 'productionplanning.drawing.productDescription.listTitle' },
		containerUuid: '6000ad4e0e934a23958349a0c3e24ba8',
	},
	dataService: ctx =>
		runInInjectionContext(ctx.injector, () => {
			return DrawingProductTemplateDataService.getInstance('6000ad4e0e934a23958349a0c3e24ba8', ctx.injector.get(DrawingDataService));
		}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.ProductTemplate', typeName: 'ProductDescriptionDto' },
	permissionUuid: '4b3bf707e6ee44748685a142a57168b4',
	layoutConfiguration: _.merge(PpsProductTemplateSharedLayout, {
		overloads: {
		}
	})
});