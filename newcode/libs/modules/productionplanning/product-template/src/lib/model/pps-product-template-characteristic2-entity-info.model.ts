import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { PpsProductTemplateDataService } from '../services/pps-product-template-data.service';


export const PRODUCT_TEMPLATE_CHARACTERISTIC2_ENTITY_INFO  = BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: '97ee789783334beb843dc421c5617cc5',
	sectionId: BasicsCharacteristicSection.ProductTempate2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsProductTemplateDataService);
	},
	isParentReadonlyFn: (parentService) => {
		//const service = parentService as PpsProductTemplateDataService;
		return false;
	},
});