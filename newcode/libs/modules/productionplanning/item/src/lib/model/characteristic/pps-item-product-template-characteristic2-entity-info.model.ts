import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { PpsItemDataService } from '../../services/pps-item-data.service';
import { IPPSItemEntity } from '../models';


export const PPS_ITEM_PRODUCT_TEMPLATE_CHARACTERISTIC2_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create2<IPPSItemEntity>({
	permissionUuid: '97ee789783334beb843dc421c5617cc5',
	gridTitle: 'productionplanning.item.productDescCharacteristic2Title',
	parentField: 'ProductDescriptionFk',
	sectionId: BasicsCharacteristicSection.ProductTempate2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},
	isParentReadonlyFn: (parentService) => {
		return false;
	},
});