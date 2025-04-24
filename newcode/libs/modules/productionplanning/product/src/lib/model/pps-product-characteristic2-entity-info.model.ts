import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { PpsProductDataService } from '../services/pps-product-data.service';


export const PPS_PRODUCT_CHARACTERISTIC2_ENTITY_INFO  = BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: '6ed3aea4bb3b4551bdcb3bd068569b3d',
	sectionId: BasicsCharacteristicSection.Product2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsProductDataService);
	},
	isParentReadonlyFn: (parentService) => {
		//const service = parentService as PpsProductDataService;
		return false;
	},
});