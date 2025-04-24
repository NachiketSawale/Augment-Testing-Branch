import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { PpsProductDataService } from '../services/pps-product-data.service';


export const PPS_PRODUCT_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '33919827cb374204a0781badb583546f',
	sectionId: BasicsCharacteristicSection.Product,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsProductDataService);
	},
	isParentReadonlyFn: (parentService) => {
		//const service = parentService as PpsProductDataService;
		return false;
	},
});