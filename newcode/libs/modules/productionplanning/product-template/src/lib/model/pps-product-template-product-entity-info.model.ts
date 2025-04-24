
import * as _ from 'lodash';
import { createLookup, FieldType } from '@libs/ui/common';
import { EntityInfo } from '@libs/ui/business-base';
import { runInInjectionContext } from '@angular/core';
import { PpsProductTemplateProductDataService } from '../services/pps-product-template-product-data.service';
import { PpsProductTemplateDataService } from '../services/pps-product-template-data.service';
import { IPpsProductTemplateEntity } from './entities/pps-product-template-entity.interface';
import {
	IPpsProductEntityGenerated, IPpsProductTemplateSimpleLookupEntity,
	PpsProductSharedLayout, ProductTemplateSharedSimpleLookupService
} from '@libs/productionplanning/shared';

export const PPS_PRODUCT_TEMPLATE_PRODUCT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsProductEntityGenerated>({
	grid: {
		title: { key: 'productionplanning.producttemplate.productListTitle' },
		containerUuid: 'cd772eebc80945fdb2a4dd7d1663c6ed',
	},
	dataService: ctx =>   runInInjectionContext(ctx.injector, () => {
		const instance = PpsProductTemplateProductDataService.getInstance('ProductionPlanning.ProductTemplate', ctx.injector.get(PpsProductTemplateDataService));
		return instance;
	}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'ProductDto' },
	permissionUuid: '70210ee234ef44af8e7e0e91d45186b2',
	layoutConfiguration: _.merge(PpsProductSharedLayout, {
		overloads: {
			ProductDescriptionFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IPpsProductTemplateEntity, IPpsProductTemplateSimpleLookupEntity>({
					dataServiceToken: ProductTemplateSharedSimpleLookupService,
					descriptionMember: 'Code'
				})
			},
		}
	})
});