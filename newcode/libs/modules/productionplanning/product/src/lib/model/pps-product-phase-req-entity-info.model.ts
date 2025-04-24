/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningSharePhaseEntityInfoFactory, ProductionplanningSharePhaseRequirementEntityInfoFactory } from '@libs/productionplanning/shared';
import { PpsProductDataService } from '../services/pps-product-data.service';
import { IInitializationContext } from '@libs/platform/common';
import { IPpsPhaseEntity } from '@libs/productionplanning/shared';
import { PpsPhaseComplete } from '@libs/productionplanning/shared';

export const PPS_PRODUCT_PHASE_REQUIREMENT_ENTITY_INFO: EntityInfo = ProductionplanningSharePhaseRequirementEntityInfoFactory.create<IPpsPhaseEntity, PpsPhaseComplete>({
	permissionUuid: 'e15dcf861fdc40a4a9c277201fbfe424',
	containerUuid: 'aa7817210eec43dbb15dfb7f30eee9e5',
	gridTitle: { key: 'productionplanning.product.phase.requirementLisTitle', text: '*Product: Phase Requirements' },
	formContainerUuid: '555ffb68a978484296d55b0d6e40e613',
	formTitle: { key: 'productionplanning.product.phase.requirementDetailTitle', text: '*Product: Phase Requirement Details' },//'productionplanning.product.phase.requirementDetailTitle',
	moduleName: 'productionplanning.product',
	parentServiceFn: (ctx) => {
		const parentOptions = {
			permissionUuid: '71b79353b3084571b7b450a492a7fd56',
			containerUuid: 'b0ed3f36403146049ffc7ca2ce17ba64',
			moduleName: 'productionplanning.product',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(PpsProductDataService)
		};
		return ProductionplanningSharePhaseEntityInfoFactory.getDataService(parentOptions, ctx);
	},
});
