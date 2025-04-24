import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { PpsItemDataService } from '../../services/pps-item-data.service';
import { IPPSItemEntity } from '../models';


export const PPS_ITEM_PRODUCT_TEMPLATE_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create<IPPSItemEntity>({
	permissionUuid: 'a924608137d644b69f1ec601bbcc4f26',
	gridTitle: 'productionplanning.item.productDescCharacteristicTitle',
	parentField: 'ProductDescriptionFk',
	sectionId: BasicsCharacteristicSection.ProductTempate,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},
	isParentReadonlyFn: (parentService) => {
		return false;
	},
});