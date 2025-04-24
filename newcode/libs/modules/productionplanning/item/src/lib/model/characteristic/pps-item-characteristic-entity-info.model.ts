
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { PpsItemDataService } from '../../services/pps-item-data.service';


export const PPS_ITEM_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '62d717e1f8bd43c6b981e2e2235a636d',
	sectionId: BasicsCharacteristicSection.PpsItem,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},
	isParentReadonlyFn: (parentService) => {
		return false;
	},
});