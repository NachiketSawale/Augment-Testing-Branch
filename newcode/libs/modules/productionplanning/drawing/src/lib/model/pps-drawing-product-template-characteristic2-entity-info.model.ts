import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { DrawingDataService } from '../services/drawing-data.service';
import { DrawingProductTemplateDataService } from '../services/drawing-product-template-data.service';


export const DRAWING_PRODUCT_TEMPLATE_CHARACTERISTIC2_ENTITY_INFO  = BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: '97ee789783334beb843dc421c5617cc5',
	sectionId: BasicsCharacteristicSection.ProductTempate2,
	parentServiceFn: (ctx) => {
		return DrawingProductTemplateDataService.getInstance('6000ad4e0e934a23958349a0c3e24ba8', ctx.injector.get(DrawingDataService));
	},
	isParentReadonlyFn: (parentService) => {
		//const service = parentService as PpsProductTemplateDataService;
		return false;
	},
});