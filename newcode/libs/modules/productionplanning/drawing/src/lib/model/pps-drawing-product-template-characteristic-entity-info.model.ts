import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { DrawingDataService } from '../services/drawing-data.service';
import { DrawingProductTemplateDataService } from '../services/drawing-product-template-data.service';


export const DRAWING_PRODUCT_TEMPLATE_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'a924608137d644b69f1ec601bbcc4f26',
	sectionId: BasicsCharacteristicSection.ProductTempate,
	parentServiceFn: (ctx) => {
		return DrawingProductTemplateDataService.getInstance('6000ad4e0e934a23958349a0c3e24ba8', ctx.injector.get(DrawingDataService));
	},
	isParentReadonlyFn: (parentService) => {
		//const service = parentService as PpsProductTemplateDataService;
		return false;
	},
});