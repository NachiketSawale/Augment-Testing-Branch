/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningSharePhaseEntityInfoFactory } from '@libs/productionplanning/shared';
import { PpsProductDataService } from '../services/pps-product-data.service';
import { IPpsProductEntity } from '../model/entities/product-entity.interface';
import { PpsProductComplete } from '../model/productionplanning-product-complete.class';

export const PPS_PRODUCT_PHASE_ENTITY_INFO: EntityInfo = ProductionplanningSharePhaseEntityInfoFactory.create<IPpsProductEntity, PpsProductComplete>({
	permissionUuid: '71b79353b3084571b7b450a492a7fd56',
	containerUuid: 'b0ed3f36403146049ffc7ca2ce17ba64',
	gridTitle: { key: 'productionplanning.product.phase.lisTitle', text: '*Product: Phases' },
	formContainerUuid: '52ddef55710c4eb29da214703e48197f',
	formTitle: 'productionplanning.product.phase.detailTitle',
	moduleName: 'productionplanning.product',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsProductDataService);
	},
});
