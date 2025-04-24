import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { PpsItemDataService } from '../../services/pps-item-data.service';
import { IPPSItemEntity } from '../entities/pps-item-entity.interface';

export const PPS_ITEM_HEADER_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create<IPPSItemEntity>({
	permissionUuid: '9246c58ebd2945c6ad51011861b569eb',
	sectionId: BasicsCharacteristicSection.ProductionplanningHeader,
	gridTitle: 'productionplanning.item.ppsHeaderCharacteristicTitle',
	parentField: 'PPSHeaderFk',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},
});