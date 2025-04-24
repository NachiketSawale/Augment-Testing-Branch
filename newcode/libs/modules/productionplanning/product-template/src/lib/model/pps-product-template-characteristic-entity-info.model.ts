import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { PpsProductTemplateDataService } from '../services/pps-product-template-data.service';


export const PRODUCT_TEMPLATE_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'a924608137d644b69f1ec601bbcc4f26',
	sectionId: BasicsCharacteristicSection.ProductTempate,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsProductTemplateDataService);
	},
	isParentReadonlyFn: (parentService) => {
		//const service = parentService as PpsProductTemplateDataService;
		return false;
	},
});