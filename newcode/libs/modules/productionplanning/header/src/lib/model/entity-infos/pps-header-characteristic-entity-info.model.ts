import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { PpsHeaderDataService } from '../../services/pps-header-data.service';

export const PPS_HEADER_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'e89a4d571d334472a9bddb6df9799d19',
	sectionId: BasicsCharacteristicSection.ProductionplanningHeader,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsHeaderDataService);
	},
	isParentReadonlyFn: (parentService) => {
		//const service = parentService as PpsHeaderDataService;
		return false;
	},
});