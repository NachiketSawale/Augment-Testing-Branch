import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { PpsItemDataService } from '../../services/pps-item-data.service';


export const PPS_ITEM_CHARACTERISTIC2_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: 'ce48eeae5d2a49d2b2c8e51d154bd8ed',
	sectionId: BasicsCharacteristicSection.PpsItem2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},
	isParentReadonlyFn: (parentService) => {
		return false;
	},
});